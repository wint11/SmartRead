'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function WorkSelector({ works, selectedId }: { works: { id: string, title: string }[], selectedId?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('novelId', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-[200px]">
      <Select value={selectedId} onValueChange={handleSelect}>
        <SelectTrigger>
          <SelectValue placeholder="选择作品" />
        </SelectTrigger>
        <SelectContent>
          {works.map(work => (
            <SelectItem key={work.id} value={work.id}>
              {work.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
