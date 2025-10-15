'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  FileText, 
  Download, 
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SOPPage() {
  return (
    <>
      <Authenticated>
        <Navbar />
        <SOPContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-medex-light to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-medex-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold text-medex-navy mb-4">Medex Portal</h1>
            <p className="text-gray-600 mb-8">Şirket içi intranet portalına hoş geldiniz</p>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-medex-navy hover:bg-medex-blue text-white">
                Giriş Yap
              </Button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}

function SOPContent() {
  const user = useQuery(api.users.getCurrentUser)
  const sops = useQuery(api.sops.getActiveSOPs)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // SOP kategorileri
  const sopCategories = [
    { id: 'all', name: 'Tüm Kategoriler', count: sops?.length || 0 },
    { id: 'hr', name: 'İnsan Kaynakları', count: sops?.filter(s => s.category === 'hr').length || 0 },
    { id: 'it', name: 'Bilgi İşlem', count: sops?.filter(s => s.category === 'it').length || 0 },
    { id: 'finance', name: 'Mali İşler', count: sops?.filter(s => s.category === 'finance').length || 0 },
    { id: 'operations', name: 'Operasyonlar', count: sops?.filter(s => s.category === 'operations').length || 0 },
  ]

  // Filtreleme
  const filteredSOPs = sops?.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const getCategoryName = (categoryId: string) => {
    return sopCategories.find(cat => cat.id === categoryId)?.name || 'Bilinmeyen'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr': return 'bg-blue-100 text-blue-800'
      case 'it': return 'bg-purple-100 text-purple-800'
      case 'finance': return 'bg-green-100 text-green-800'
      case 'operations': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Standart Operasyon Prosedürleri (SOP)</h1>
          <p className="text-gray-600">Şirket prosedürleri ve standart operasyon talimatları</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {sopCategories.slice(1).map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-medex-navy" />
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-medex-navy">{category.count}</div>
                <p className="text-sm text-gray-600">Prosedür</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>SOP Arama ve Filtreleme</CardTitle>
            <CardDescription>Prosedürleri kategorilere göre filtreleyin ve arayın</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="SOP başlığı veya açıklama ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medex-navy"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medex-navy"
                >
                  {sopCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOP Documents */}
        <div className="space-y-6">
          {filteredSOPs.map((doc) => (
            <Card key={doc._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{doc.title}</h3>
                      <Badge className={getCategoryColor(doc.category)}>
                        {getCategoryName(doc.category)}
                      </Badge>
                      <Badge variant="outline">{doc.version}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{doc.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{doc.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Güncellenme: {new Date(doc.updatedAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{doc.downloads} indirme</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Görüntüle
                    </Button>
                    <Button size="sm" className="text-white" style={{ backgroundColor: '#003466' }}>
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredSOPs.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SOP bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Arama kriterlerinize uygun prosedür bulunamadı.' 
                    : 'Henüz prosedür dokümanı bulunmuyor.'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Admin panelinden SOP ekleyebilirsiniz</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Access */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Hızlı Erişim</CardTitle>
            <CardDescription>En çok kullanılan prosedürlere hızlı erişim</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/sop/hr">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  İK Prosedürleri
                </Button>
              </Link>
              <Link href="/sop/it">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  IT Prosedürleri
                </Button>
              </Link>
              <Link href="/sop/operations">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Operasyon Prosedürleri
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
