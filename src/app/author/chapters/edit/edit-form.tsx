'use client'

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveChapter, ChapterFormState } from "../publish/actions"
import { deleteChapter } from "./actions"
import { useToast } from "@/hooks/use-toast"

const initialState: ChapterFormState = {
  error: null,
}

export function EditForm({ novelId, chapter, onDelete }: { novelId: string, chapter: { id: string, title: string, content: string, isVip?: boolean }, onDelete?: () => void }) {
  const [state, formAction, isPending] = useActionState(saveChapter, initialState)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  
  // Controlled inputs to allow updates if needed, though 'key' prop on parent usually handles reset
  const [title, setTitle] = useState(chapter.title)
  const [content, setContent] = useState(chapter.content)
  const [isVip, setIsVip] = useState(chapter.isVip || false)

  useEffect(() => {
    setTitle(chapter.title)
    setContent(chapter.content)
    setIsVip(chapter.isVip || false)
  }, [chapter])

  useEffect(() => {
    if (state.success) {
      toast({
        title: "保存成功",
        description: "章节内容已更新",
      })
    }
  }, [state.success, toast])

  const handleDelete = async () => {
    if (!confirm("确定要删除该章节吗？删除后无法恢复。")) return
    
    setIsDeleting(true)
    const result = await deleteChapter(chapter.id)
    setIsDeleting(false)

    if (result.success) {
      toast({ title: "删除成功" })
      if (onDelete) onDelete()
    } else {
      toast({ title: "删除失败", description: result.error, variant: "destructive" })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>编辑章节: {chapter.title}</CardTitle>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDelete} 
          disabled={isDeleting || isPending}
        >
          {isDeleting ? "删除中..." : "删除章节"}
        </Button>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="novelId" value={novelId} />
          <input type="hidden" name="id" value={chapter.id} />
          
          <div className="space-y-2">
            <Label htmlFor="title">章节标题</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="请输入章节标题" 
              required 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {state.error && typeof state.error === 'object' && state.error.title && (
              <p className="text-sm text-red-500">{state.error.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">正文内容</Label>
            <Textarea 
              id="content" 
              name="content" 
              placeholder="请输入章节正文" 
              className="min-h-[400px]" 
              required 
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {state.error && typeof state.error === 'object' && state.error.content && (
              <p className="text-sm text-red-500">{state.error.content[0]}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isVip"
              name="isVip"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
            />
            <Label htmlFor="isVip">设置为 VIP 章节</Label>
          </div>

          {state.error && typeof state.error === 'string' && (
            <p className="text-sm text-red-500">{state.error}</p>
          )}

          <div className="flex gap-4 pt-4">
            <Button 
              className="flex-1" 
              type="submit" 
              name="action" 
              value="draft" 
              variant="secondary"
              disabled={isPending}
            >
              保存为草稿
            </Button>
            <Button 
              className="flex-1" 
              type="submit" 
              name="action" 
              value="publish" 
              disabled={isPending}
            >
              {isPending ? "提交中..." : "提交审核"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
