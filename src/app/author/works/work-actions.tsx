'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Image as ImageIcon, Loader2 } from "lucide-react"
import { deleteNovel, requestCoverUpdate, toggleNovelCompletion } from "./actions"
import type { Novel } from "@prisma/client"

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return "操作失败"
}

export function WorkActions({
  novel,
}: {
  novel: Pick<Novel, "id" | "pendingCoverUrl" | "serializationStatus">
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingCover, setIsUpdatingCover] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [newCoverUrl, setNewCoverUrl] = useState("")
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false)

  const handleDelete = async () => {
    if (!confirm("确定要删除这部作品吗？此操作不可恢复。")) return

    setIsDeleting(true)
    try {
      await deleteNovel(novel.id)
      alert("作品已删除")
    } catch {
      alert("删除失败")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCoverUpdate = async () => {
    if (!newCoverUrl) return
    
    setIsUpdatingCover(true)
    try {
      await requestCoverUpdate(novel.id, newCoverUrl)
      alert("封面修改申请已提交，请等待管理员审核")
      setIsCoverDialogOpen(false)
      setNewCoverUrl("")
    } catch (error) {
      alert(getErrorMessage(error))
    } finally {
      setIsUpdatingCover(false)
    }
  }

  const handleComplete = async () => {
    if (!confirm("确定要完结这部作品吗？完结后将无法再更改为连载状态。")) return

    setIsCompleting(true)
    try {
      await toggleNovelCompletion(novel.id)
      alert("作品已设为完结")
    } catch (error) {
      alert(getErrorMessage(error))
    } finally {
      setIsCompleting(false)
    }
  }

  const hasPendingCover = !!novel.pendingCoverUrl
  const isCompleted = novel.serializationStatus === 'COMPLETED'

  return (
    <div className="flex items-center gap-2">
      {!isCompleted && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleComplete} 
          disabled={isCompleting}
        >
          {isCompleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "完结作品"}
        </Button>
      )}

      <Dialog open={isCoverDialogOpen} onOpenChange={setIsCoverDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={hasPendingCover}>
            <ImageIcon className="mr-2 h-4 w-4" />
            {hasPendingCover ? "封面审核中" : "修改封面"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改作品封面</DialogTitle>
            <DialogDescription>
              请输入新的封面图片链接。修改提交后需要管理员审核通过才会生效。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverUrl" className="text-right">
                图片链接
              </Label>
              <Input
                id="coverUrl"
                value={newCoverUrl}
                onChange={(e) => setNewCoverUrl(e.target.value)}
                placeholder="https://..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCoverDialogOpen(false)}>取消</Button>
            <Button onClick={handleCoverUpdate} disabled={isUpdatingCover || !newCoverUrl}>
              {isUpdatingCover && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              提交申请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleDelete} 
        disabled={isDeleting}
      >
        {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
            </>
        )}
      </Button>
    </div>
  )
}
