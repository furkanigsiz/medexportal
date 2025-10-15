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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Users,
  Crown
} from 'lucide-react'
import { useState } from 'react'

export default function AdminDocumentsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminDocumentsContent />
    </>
  )
}

function UnauthenticatedAdminDocuments() {
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

function AdminDocumentsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const documents = useQuery(api.documents.getDocuments)
  const deleteDocument = useMutation(api.documents.deleteDocument)
  const [isAdding, setIsAdding] = useState(false)

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

  const getAccessLevelIcon = (level: string) => {
    switch (level) {
      case 'employee':
        return <Users className="w-4 h-4 text-green-500" />
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />
      case 'superadmin':
        return <Crown className="w-4 h-4 text-purple-500" />
      default:
        return <Users className="w-4 h-4 text-gray-500" />
    }
  }

  const getAccessLevelText = (level: string) => {
    switch (level) {
      case 'employee':
        return 'Tüm Çalışanlar'
      case 'admin':
        return 'Yöneticiler'
      case 'superadmin':
        return 'Süper Yöneticiler'
      default:
        return level
    }
  }

  const getAccessLevelVariant = (level: string) => {
    switch (level) {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Döküman Yönetimi</h1>
          <p className="text-gray-600">Şirket dökümanlarını yönetin ve erişim seviyelerini ayarlayın</p>
        </div>

        {/* Add Document Button */}
        <div className="mb-6">
          <AddDocumentDialog />
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {documents && documents.length > 0 ? (
            documents.map((document) => (
              <Card key={document._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-medex-navy" />
                        <h3 className="text-lg font-semibold text-gray-900">{document.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Google Drive ID: {document.driveFileId}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Oluşturulma: {new Date(document.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <Badge variant={getAccessLevelVariant(document.accessLevel)}>
                        {getAccessLevelIcon(document.accessLevel)}
                        <span className="ml-1">{getAccessLevelText(document.accessLevel)}</span>
                      </Badge>
                      
                      {/* Admin Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            if (confirm('Bu dökümanı silmek istediğinizden emin misiniz?')) {
                              try {
                                await deleteDocument({ documentId: document._id })
                              } catch (error) {
                                console.error('Error deleting document:', error)
                                alert('Döküman silinirken bir hata oluştu')
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz döküman bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk dökümanınızı eklemek için yukarıdaki butonu kullanın</p>
                <AddDocumentDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AddDocumentDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [driveFileId, setDriveFileId] = useState('')
  const [accessLevel, setAccessLevel] = useState<'employee' | 'admin' | 'superadmin'>('employee')
  const addDocument = useMutation(api.documents.addDocument)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !driveFileId.trim()) return

    try {
      await addDocument({
        title: title.trim(),
        driveFileId: driveFileId.trim(),
        accessLevel: accessLevel,
      })
      setTitle('')
      setDriveFileId('')
      setAccessLevel('employee')
      setOpen(false)
    } catch (error) {
      console.error('Error adding document:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medex-navy hover:bg-medex-blue text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Döküman Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Döküman Ekle</DialogTitle>
          <DialogDescription>
            Google Drive&apos;dan bir döküman ekleyin ve erişim seviyesini belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Döküman Başlığı
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Döküman başlığını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="driveFileId" className="block text-sm font-medium text-gray-700 mb-1">
              Google Drive Dosya ID
            </label>
            <Input
              id="driveFileId"
              value={driveFileId}
              onChange={(e) => setDriveFileId(e.target.value)}
              placeholder="Google Drive dosya ID'sini girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="accessLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Erişim Seviyesi
            </label>
            <select
              id="accessLevel"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as 'employee' | 'admin' | 'superadmin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medex-navy"
            >
              <option value="employee">Tüm Çalışanlar</option>
              <option value="admin">Sadece Yöneticiler</option>
              <option value="superadmin">Sadece Süper Yöneticiler</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="bg-medex-navy hover:bg-medex-blue text-white">
              Döküman Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
