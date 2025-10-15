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
  User
} from 'lucide-react'
import { useState } from 'react'

export default function AdminNewsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminNewsContent />
    </>
  )
}

function UnauthenticatedAdminNews() {
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

function AdminNewsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const news = useQuery(api.news.getNews)
  const deleteNews = useMutation(api.news.deleteNews)

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
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Duyuru Yönetimi</h1>
          <p className="text-gray-600">Şirket duyurularını yönetin ve yayınlayın</p>
        </div>

        {/* Add News Button */}
        <div className="mb-6">
          <AddNewsDialog />
        </div>

        {/* News List */}
        <div className="space-y-4">
          {news && news.length > 0 ? (
            news.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-medex-navy" />
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{item.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={async () => {
                          if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
                            try {
                              await deleteNews({ newsId: item._id })
                            } catch (error) {
                              console.error('Error deleting news:', error)
                              alert('Duyuru silinirken bir hata oluştu')
                            }
                          }
                        }}
                      >
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
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz duyuru bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk duyurunuzu eklemek için yukarıdaki butonu kullanın</p>
                <AddNewsDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AddNewsDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const createNews = useMutation(api.news.createNews)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      await createNews({
        title: title.trim(),
        content: content.trim(),
      })
      setTitle('')
      setContent('')
      setOpen(false)
    } catch (error) {
      console.error('Error creating news:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medex-navy hover:bg-medex-blue text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Duyuru Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Yeni Duyuru Ekle</DialogTitle>
          <DialogDescription>
            Şirket duyurusu oluşturun ve detaylarını belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Duyuru Başlığı
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Duyuru başlığını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Duyuru İçeriği
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Duyuru içeriğini girin..."
              rows={6}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="bg-medex-navy hover:bg-medex-blue text-white">
              Duyuru Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
