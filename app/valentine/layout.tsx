'use client'

import React from "react"

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ValentineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Hide navbar when viewing valentine messages
    const isViewingMessage = pathname === '/valentine/view' || pathname?.includes('/valentine/view')
    if (isViewingMessage) {
      document.documentElement.style.setProperty('--hide-navbar', '1')
    } else {
      document.documentElement.style.setProperty('--hide-navbar', '0')
    }

    return () => {
      document.documentElement.style.setProperty('--hide-navbar', '0')
    }
  }, [pathname])

  if (!mounted) return null

  return <>{children}</>
}
