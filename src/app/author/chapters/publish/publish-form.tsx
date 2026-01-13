'use client'

import { useActionState, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveChapter, ChapterFormState } from "./actions"
import { useToast } from "@/hooks/use-toast"

const initialState: ChapterFormState = {
  error: null,
}

export function PublishForm({ novelId, drafts, initialDraftId }: { novelId: string, drafts: any[], initialDraftId?: string }) {
  const [state, formAction, isPending] = useActionState(saveChapter, initialState)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [currentDraftId, setCurrentDraftId] = useState<string>("")
  const { toast } = useToast()

  // Load initial draft if provided
  useEffect(() => {
    if (initialDraftId) {
      const draft = drafts.find(d => d.id === initialDraftId)
      if (draft) {
        setTitle(draft.title)
        setContent(draft.content)
        setCurrentDraftId(draft.id)
      }
    }
  }, [initialDraftId, drafts])

  // Reset form on success
  useEffect(() => {
    if (state.success) {
      toast({
        title: "操作成功",
        description: "章节已保存",
      })
      // If we were creating new, clear form. If updating draft, maybe keep it?
      // Usually clear to allow next chapter.
      setTitle("")
      setContent("")
      setCurrentDraftId("")
    }
  }, [state.success, toast])

  const handleLoadDraft = (draftId: string) => {
    if (draftId === "new") {
      setTitle("")
      setContent("")
      setCurrentDraftId("")
      return
    }
    const draft = drafts.find(d => d.id === draftId)
    if (draft) {
      setTitle(draft.title)
      setContent(draft.content)
      setCurrentDraftId(draft.id)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {currentDraftId ? "编辑草稿" : "编写新章节"}
        </CardTitle>
        <div className="w-[200px]">
          <Select value={currentDraftId || "new"} onValueChange={handleLoadDraft}>
            <SelectTrigger>
              <SelectValue placeholder="加载草稿" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">新建章节</SelectItem>
              {drafts.map(draft => (
                <SelectItem key={draft.id} value={draft.id}>
                  {draft.title} ({new Date(draft.updatedAt).toLocaleDateString()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="novelId" value={novelId} />
          {currentDraftId && <input type="hidden" name="id" value={currentDraftId} />}
          
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
              保存草稿
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
