'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditForm } from "./edit-form"
import { useRouter } from "next/navigation"

type Chapter = {
  id: string
  title: string
  content: string
  status: string
  order: number
}

export function EditChapterClient({ novelId, chapters }: { novelId: string, chapters: Chapter[] }) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const router = useRouter()

  const handleChapterDeleted = () => {
    setSelectedChapter(null)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>章节列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto space-y-2">
              {chapters.length === 0 ? (
                <p className="text-muted-foreground text-sm">暂无章节</p>
              ) : (
                chapters.map(chapter => (
                  <div 
                    key={chapter.id} 
                    className={`p-3 border rounded text-sm cursor-pointer hover:bg-muted transition-colors flex justify-between items-center ${selectedChapter?.id === chapter.id ? 'bg-muted border-primary' : ''}`}
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    <span className="truncate flex-1 font-medium">{chapter.title}</span>
                    <Badge variant={
                      chapter.status === 'PUBLISHED' ? 'default' : 
                      chapter.status === 'PENDING' ? 'secondary' : 
                      chapter.status === 'REJECTED' ? 'destructive' : 'outline'
                    } className="ml-2 text-xs">
                      {chapter.status === 'PUBLISHED' ? '已发布' : 
                       chapter.status === 'PENDING' ? '审核中' : 
                       chapter.status === 'REJECTED' ? '已拒绝' : '草稿'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {selectedChapter ? (
          <EditForm 
            novelId={novelId} 
            chapter={selectedChapter} 
            key={selectedChapter.id} 
            onDelete={handleChapterDeleted}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg min-h-[400px]">
            请在左侧选择要编辑的章节
          </div>
        )}
      </div>
    </div>
  )
}
