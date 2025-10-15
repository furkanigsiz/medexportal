'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Shield, 
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AdminUsersPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <UsersContent />
    </>
  )
}

function UnauthenticatedAdminUsers() {
  return (
        <div className="min-h-screen bg-gradient-to-br from-medex-light to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-medex-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold text-medex-navy mb-4">Medex Portal</h1>
            <p className="text-gray-600 mb-8">Şirket içi intranet portalına hoş geldiniz</p>
            <Button size="lg" className="bg-medex-navy hover:bg-medex-blue text-white">
              Giriş Yap
            </Button>
          </div>
        </div>
  )
}

function UsersContent() {
  const user = useQuery(api.users.getCurrentUser)
  const users = useQuery(api.users.getAllUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)

  // Admin yetkisi kontrolü
  if (user && (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Yetkisiz Erişim</h2>
            <p className="text-gray-600 mb-4">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
            <Link href="/">
              <Button className="bg-medex-navy hover:bg-medex-blue text-white">
                Ana Sayfaya Dön
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filtreleme
  const filteredUsers = users?.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || u.role === selectedRole
    return matchesSearch && matchesRole
  }) || []

  const roleStats = {
    total: users?.length || 0,
    employees: users?.filter(u => u.role === 'employee').length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    superadmins: users?.filter(u => u.role === 'superadmin').length || 0,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-medex-navy mb-2">Kullanıcı Yönetimi</h1>
              <p className="text-gray-600">Kullanıcı rolleri ve yetkilerini yönetin</p>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                ← Yönetim Paneli
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-medex-navy" />
                <CardTitle className="text-lg">Toplam Kullanıcı</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medex-navy">{roleStats.total}</div>
              <p className="text-sm text-gray-600">Kayıtlı kullanıcı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">Çalışanlar</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{roleStats.employees}</div>
              <p className="text-sm text-gray-600">Normal kullanıcı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-orange-600" />
                <CardTitle className="text-lg">Adminler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{roleStats.admins}</div>
              <p className="text-sm text-gray-600">Yönetici</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-600" />
                <CardTitle className="text-lg">Süper Admin</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{roleStats.superadmins}</div>
              <p className="text-sm text-gray-600">Sistem yöneticisi</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Kullanıcı Filtreleme</CardTitle>
            <CardDescription>Kullanıcıları arayın ve filtreleyin</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Kullanıcı adı veya email ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medex-navy"
                >
                  <option value="all">Tüm Roller</option>
                  <option value="employee">Çalışan</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Süper Admin</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kullanıcı Listesi</CardTitle>
                <CardDescription>
                  {filteredUsers.length} kullanıcı bulundu
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-white transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Kayıt: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={
                        user.role === 'superadmin' ? 'destructive' :
                        user.role === 'admin' ? 'secondary' :
                        'outline'
                      }
                    >
                      {user.role === 'superadmin' ? 'Süper Admin' :
                     user.role === 'admin' ? 'Admin' :
                     'Çalışan'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kullanıcı bulunamadı</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedRole !== 'all' 
                      ? 'Arama kriterlerinize uygun kullanıcı bulunamadı.' 
                      : 'Henüz kullanıcı kaydı bulunmuyor.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
