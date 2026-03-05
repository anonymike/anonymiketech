'use client'

import { usePathname } from 'next/navigation'
import DesktopNavbar from '@/components/DesktopNavbar'
import MobileMenu from '@/components/MobileMenu'

export default function NavbarWrapper() {
  const pathname = usePathname()
  
  // Hide navbar on admin routes
  if (pathname?.startsWith('/admin')) {
    console.log('[v0] Admin route detected, hiding navbar')
    return null
  }

  return (
    <>
      <DesktopNavbar />
      <MobileMenu />
    </>
  )
}
