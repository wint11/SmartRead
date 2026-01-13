'use client'

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createWork, FormState } from "./actions"

const initialState: FormState = {
  error: null,
}

export default function CreateWorkPage() {
  const [state, formAction, isPending] = useActionState(createWork, initialState)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <h1 className="text-3xl font-bold tracking-tight">创建新作品</h1>
       <Card>
         <CardHeader>
           <CardTitle>作品基础信息</CardTitle>
           <CardDescription>填写您的作品基本信息，创建后可开始发布章节。</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
           <form action={formAction} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="title">标题</Label>
               <Input id="title" name="title" placeholder="请输入作品标题" required />
               {state.error && typeof state.error === 'object' && state.error.title && (
                 <p className="text-sm text-red-500">{state.error.title[0]}</p>
               )}
             </div>
             
             <div className="space-y-2">
               <Label htmlFor="coverUrl">封面图片链接 (可选)</Label>
               <Input id="coverUrl" name="coverUrl" placeholder="https://example.com/cover.jpg" />
               {state.error && typeof state.error === 'object' && state.error.coverUrl && (
                 <p className="text-sm text-red-500">{state.error.coverUrl[0]}</p>
               )}
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="type">类型</Label>
                 <Select name="type" required defaultValue="NOVEL">
                   <SelectTrigger>
                     <SelectValue placeholder="选择类型" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="NOVEL">小说</SelectItem>
                     <SelectItem value="PAPER">论文</SelectItem>
                     <SelectItem value="AUTOBIOGRAPHY">自传</SelectItem>
                     <SelectItem value="ARTICLE">随笔</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="category">分类</Label>
                 <Input id="category" name="category" placeholder="例如：科幻、历史" required />
                 {state.error && typeof state.error === 'object' && state.error.category && (
                   <p className="text-sm text-red-500">{state.error.category[0]}</p>
                 )}
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="description">简介</Label>
               <Textarea id="description" name="description" placeholder="请输入作品简介" className="h-32" required />
               {state.error && typeof state.error === 'object' && state.error.description && (
                 <p className="text-sm text-red-500">{state.error.description[0]}</p>
               )}
             </div>
             {state.error && typeof state.error === 'string' && (
               <p className="text-sm text-red-500">{state.error}</p>
             )}
             <Button className="w-full" type="submit" disabled={isPending}>
               {isPending ? "创建中..." : "创建作品"}
             </Button>
           </form>
         </CardContent>
       </Card>
    </div>
  )
}
