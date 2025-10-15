'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Calendar, 
  Shield,
  ArrowLeft,
  Edit,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <ProfileContent />
    </>
  )
}

function ProfileContent() {
  const user = useQuery(api.users.getCurrentUser)
  const tickets = useQuery(api.tickets.getTickets)

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-medex-navy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Profil bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-medex-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profil Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Kullanıcı bilgileri yüklenemedi</p>
          <Link href="/">
            <Button className="bg-medex-navy hover:bg-medex-blue text-white">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'employee':
        return 'Çalışan'
      case 'admin':
        return 'Yönetici'
      case 'superadmin':
        return 'Süper Yönetici'
      default:
        return role
    }
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'employee':
        return 'default'
      case 'admin':
        return 'secondary'
      case 'superadmin':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const userTickets = tickets?.filter(ticket => ticket.userId === user._id) || []

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="outline" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Ana Sayfaya Dön</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-medex-navy mb-2">Profil</h1>
          <p className="text-xl text-gray-600">Kullanıcı bilgileri ve hesap ayarları</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil Bilgileri */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-medex-navy" />
                  <span>Kişisel Bilgiler</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-medex-navy rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">E-posta</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Rol</p>
                      <Badge variant={getRoleVariant(user.role)}>
                        {getRoleText(user.role)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Üyelik Tarihi</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Destek Talepleri */}
            <Card>
              <CardHeader>
                <CardTitle>Destek Taleplerim</CardTitle>
                <CardDescription>Oluşturduğunuz destek talepleri</CardDescription>
              </CardHeader>
              <CardContent>
                {userTickets.length > 0 ? (
                  <div className="space-y-3">
                    {userTickets.slice(0, 5).map((ticket) => (
                      <div key={ticket._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            ticket.status === 'open' ? 'default' : 
                            ticket.status === 'in_progress' ? 'secondary' : 
                            'outline'
                          }
                        >
                          {ticket.status === 'open' ? 'Açık' : 
                           ticket.status === 'in_progress' ? 'İşlemde' : 
                           'Kapalı'}
                        </Badge>
                      </div>
                    ))}
                    {userTickets.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{userTickets.length - 5} talep daha
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Henüz destek talebi oluşturmadınız</p>
                )}
                
                <div className="mt-4">
                  <Link href="/tickets">
                    <Button variant="outline" className="w-full">
                      Tüm Talepleri Gör
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            {/* Hızlı Erişim */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-medex-navy" />
                  <span>Hızlı Erişim</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/tickets">
                  <Button variant="outline" className="w-full justify-start">
                    Destek Talepleri
                  </Button>
                </Link>
                <Link href="/documents">
                  <Button variant="outline" className="w-full justify-start">
                    Dökümanlar
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="w-full justify-start">
                    Etkinlikler
                  </Button>
                </Link>
                {user.role === 'admin' || user.role === 'superadmin' ? (
                  <Link href="/admin">
                    <Button variant="outline" className="w-full justify-start">
                      Yönetim Paneli
                    </Button>
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            {/* Hesap İstatistikleri */}
            <Card>
              <CardHeader>
                <CardTitle>Hesap İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Toplam Talep</span>
                  <span className="font-semibold">{userTickets.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Açık Talepler</span>
                  <span className="font-semibold text-red-600">
                    {userTickets.filter(t => t.status === 'open').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Çözülen Talepler</span>
                  <span className="font-semibold text-green-600">
                    {userTickets.filter(t => t.status === 'closed').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
