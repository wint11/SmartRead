"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Bookmark, BookmarkCheck } from "lucide-react"

interface AddToBookshelfProps {
  novel: {
    id: string
    title: string
    author: string
    coverUrl: string | null
  }
}

export function AddToBookshelf({ novel }: AddToBookshelfProps) {
  const [isInShelf, setIsInShelf] = React.useState(false)

  React.useEffect(() => {
    const shelf = JSON.parse(localStorage.getItem("bookshelf") || "[]")
    setIsInShelf(shelf.includes(novel.id))
  }, [novel.id])

  const toggleShelf = () => {
    const shelf = JSON.parse(localStorage.getItem("bookshelf") || "[]") as string[]
    let newShelf
    if (shelf.includes(novel.id)) {
      newShelf = shelf.filter(id => id !== novel.id)
      setIsInShelf(false)
    } else {
      newShelf = [...shelf, novel.id]
      setIsInShelf(true)
    }
    localStorage.setItem("bookshelf", JSON.stringify(newShelf))
  }

  return (
    <Button 
      size="lg" 
      variant={isInShelf ? "secondary" : "outline"} 
      className="h-12 flex-1 gap-2 text-base"
      onClick={toggleShelf}
    >
      {isInShelf ? (
        <>
          <BookmarkCheck className="h-5 w-5" />
          已在书架
        </>
      ) : (
        <>
          <Bookmark className="h-5 w-5" />
          加入书架
        </>
      )}
    </Button>
  )
}
