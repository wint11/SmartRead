"use client"

import { usePathname } from "next/navigation"

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  if (pathname?.startsWith("/hidden_directory")) {
    return null
  }
  
  return <>{children}</>
}
