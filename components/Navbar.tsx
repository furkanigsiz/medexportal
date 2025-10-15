'use client'

import { UserButton, SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Settings, 
  Users
} from 'lucide-react'
import Link from 'next/link'
import PillNav from './PillNav'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, isLoaded } = useUser()
  const currentUser = useQuery(api.users.getCurrentUser)
  const pathname = usePathname()

  // Tüm sayfalarımızı içeren navigation items
  const navItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Dökümanlar', href: '/documents' },
    { label: 'Etkinlikler', href: '/events' },
    { label: 'Haberler', href: '/news' },
    { label: 'Eğitimler', href: '/trainings' },
    { label: 'Destek', href: '/tickets' },
    { label: 'SOP', href: '/sop' },
    { label: 'Forum', href: '/forum' },
    { label: 'Geri Bildirim', href: '/feedback' },
    { label: 'Profil', href: '/profile' },
  ]

  // Admin sayfalarını ekle
  if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin')) {
    navItems.push(
      { label: 'Yönetim', href: '/admin' },
      { label: 'Kullanıcılar', href: '/admin/users' }
    )
  }

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Medex Logo - Ayrı konumlandırılmış */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <img 
                src="/medex-logo.png" 
                alt="MEDEX Logo" 
                className="h-12 w-auto object-contain"
                style={{ minWidth: '120px', maxWidth: '200px' }}
              />
            </Link>
          </div>

          {/* PillNav Component - Logo olmadan */}
          <div className="flex-1 flex justify-center">
            <PillNav
              logo=""
              logoAlt=""
              items={navItems}
              activeHref={pathname}
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#FFFFFF"
              pillColor="#003466"
              hoveredPillTextColor="#FFFFFF"
              pillTextColor="#FFFFFF"
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4 ml-4">
            {!isLoaded ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 p-2">
                      <UserButton />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[9999] bg-white shadow-xl border border-gray-200 rounded-md">
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/profile" className="flex items-center space-x-2 w-full">
                        <Settings className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
                      <DropdownMenuItem className="cursor-pointer">
                        <Link href="/admin" className="flex items-center space-x-2 w-full">
                          <Users className="w-4 h-4" />
                          <span>Yönetim Paneli</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="text-white shadow-lg" style={{ backgroundColor: '#003466' }}>
                  Giriş Yap
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
