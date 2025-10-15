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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Clock,
  User,
  BookOpen
} from 'lucide-react'
import { useState } from 'react'

export default function AdminSOPPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminSOPContent />
    </>
  )
}

function UnauthenticatedAdminSOP() {
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

function AdminSOPContent() {
  const user = useQuery(api.users.getCurrentUser)
  const sops = useQuery(api.sops.getSOPs)

  // Admin yetkisi kontrolü
  if (user && (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Yetkisiz Erişim</h2>
            <p className="text-gray-600 mb-4">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
            <Button className="bg-medex-navy hover:bg-medex-blue text-white">
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">SOP Yönetimi</h1>
          <p className="text-gray-600">Standart Operasyon Prosedürlerini yönetin</p>
        </div>

        {/* Add SOP Button */}
        <div className="mb-6">
          <AddSOPDialog />
        </div>

        {/* SOP List */}
        <div className="space-y-4">
          {sops && sops.length > 0 ? (
            sops.map((sop) => (
              <Card key={sop._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className="w-5 h-5 text-medex-navy" />
                        <h3 className="text-lg font-semibold text-gray-900">{sop.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{sop.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(sop.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>Yönetici</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-1" />
                        Düzenle
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4 mr-1" />
                        Sil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz SOP bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk SOP&apos;unuzu eklemek için yukarıdaki butonu kullanın</p>
                <AddSOPDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AddSOPDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const createSOP = useMutation(api.sops.addSOP)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !content.trim()) return

    try {
      await createSOP({
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        author: 'Admin',
        category: 'general',
        version: '1.0',
      })
      setTitle('')
      setDescription('')
      setContent('')
      setOpen(false)
    } catch (error) {
      console.error('Error creating SOP:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medex-navy hover:bg-medex-blue text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni SOP Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni SOP Ekle</DialogTitle>
          <DialogDescription>
            Standart Operasyon Prosedürü oluşturun ve detaylarını belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              SOP Başlığı
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="SOP başlığını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="SOP açıklamasını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              SOP İçeriği
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="SOP içeriğini girin..."
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="bg-medex-navy hover:bg-medex-blue text-white">
              SOP Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
