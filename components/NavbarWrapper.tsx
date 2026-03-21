'use client'

import { usePathname } from 'next/navigation'
import DesktopNavbar from '@/components/DesktopNavbar'
import MobileMenu from '@/components/MobileMenu'

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  // Hide navbar on admin routes and dashboard routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/chatbots-ai/dashboard')) {
    return null
  }

  return (
    <>
      <DesktopNavbar />
      <MobileMenu />
    </>
  )
}
