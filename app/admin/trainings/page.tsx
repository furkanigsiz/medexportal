'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Clock,
  User,
  Play,
  Download,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

export default function AdminTrainingsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminTrainingsContent />
    </>
  )
}

function UnauthenticatedAdminTrainings() {
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

function AdminTrainingsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const trainings = useQuery(api.trainings.getTrainings)
  const addTraining = useMutation(api.trainings.addTraining)
  const updateTraining = useMutation(api.trainings.updateTraining)
  const deleteTraining = useMutation(api.trainings.deleteTraining)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddingTraining, setIsAddingTraining] = useState(false)
  const [editingTraining, setEditingTraining] = useState<{ _id: string; title: string; description: string; content: string; category: string; duration: string; difficulty: string; instructor: string; videoUrl?: string; materials?: string[] } | null>(null)
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    content: '',
    category: 'technical',
    duration: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    instructor: '',
    videoUrl: '',
    materials: [] as string[]
  })

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

  // Eğitim kategorileri
  const categories = [
    { id: 'all', name: 'Tüm Kategoriler' },
    { id: 'technical', name: 'Teknik Eğitimler' },
    { id: 'soft-skills', name: 'Yumuşak Beceriler' },
    { id: 'compliance', name: 'Uyum Eğitimleri' },
    { id: 'leadership', name: 'Liderlik' },
    { id: 'safety', name: 'Güvenlik' },
    { id: 'other', name: 'Diğer' }
  ]

  // Filtreleme
  const filteredTrainings = trainings?.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const handleAddTraining = async () => {
    if (!newTraining.title || !newTraining.description || !newTraining.content) {
      alert('Lütfen tüm gerekli alanları doldurun')
      return
    }

    try {
      await addTraining({
        title: newTraining.title,
        description: newTraining.description,
        content: newTraining.content,
        category: newTraining.category,
        duration: newTraining.duration,
        difficulty: newTraining.difficulty,
        instructor: newTraining.instructor,
        videoUrl: newTraining.videoUrl || undefined,
        materials: newTraining.materials
      })
      
      setNewTraining({
        title: '',
        description: '',
        content: '',
        category: 'technical',
        duration: '',
        difficulty: 'beginner',
        instructor: '',
        videoUrl: '',
        materials: []
      })
      setIsAddingTraining(false)
      alert('Eğitim başarıyla eklendi!')
    } catch (error) {
      console.error('Eğitim ekleme hatası:', error)
      alert('Eğitim eklenirken bir hata oluştu.')
    }
  }

  const handleUpdateTraining = async () => {
    if (!editingTraining) return

    try {
      await updateTraining({
        id: editingTraining._id as Id<"trainings">,
        title: editingTraining.title,
        description: editingTraining.description,
        content: editingTraining.content,
        category: editingTraining.category,
        duration: editingTraining.duration,
        difficulty: editingTraining.difficulty as 'beginner' | 'intermediate' | 'advanced',
        instructor: editingTraining.instructor,
        videoUrl: editingTraining.videoUrl || undefined,
        materials: editingTraining.materials
      })
      
      setEditingTraining(null)
      alert('Eğitim başarıyla güncellendi!')
    } catch (error) {
      console.error('Eğitim güncelleme hatası:', error)
      alert('Eğitim güncellenirken bir hata oluştu.')
    }
  }

  const handleDeleteTraining = async (trainingId: string) => {
    if (!confirm('Bu eğitimi silmek istediğinizden emin misiniz?')) return

    try {
      await deleteTraining({ trainingId: trainingId as Id<"trainings"> })
      alert('Eğitim başarıyla silindi!')
    } catch (error) {
      console.error('Eğitim silme hatası:', error)
      alert('Eğitim silinirken bir hata oluştu.')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Başlangıç'
      case 'intermediate': return 'Orta'
      case 'advanced': return 'İleri'
      default: return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-medex-navy mb-2">Eğitim Yönetimi</h1>
              <p className="text-gray-600">Eğitim materyallerini yönetin</p>
            </div>
            <Button 
              onClick={() => setIsAddingTraining(true)}
              className="text-white"
              style={{ backgroundColor: '#003466' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Eğitim Ekle
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Input
                  placeholder="Eğitim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Trainings List */}
        <div className="space-y-4">
          {filteredTrainings.map((training) => (
            <Card key={training._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                      <Badge className={getDifficultyColor(training.difficulty)}>
                        {getDifficultyText(training.difficulty)}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {training.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{training.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{training.instructor}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{training.duration}</span>
                      </div>
                      {training.videoUrl && (
                        <div className="flex items-center space-x-1">
                          <Play className="w-4 h-4" />
                          <span>Video</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingTraining(training)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Düzenle
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTraining(training._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrainings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz eğitim bulunmuyor</h3>
              <p className="text-gray-600">Yeni eğitim ekleyerek başlayın</p>
            </CardContent>
          </Card>
        )}

        {/* Add Training Modal */}
        {isAddingTraining && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Yeni Eğitim Ekle</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingTraining(false)}
                  className="h-8 w-8 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim Başlığı</label>
                    <Input
                      value={newTraining.title}
                      onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                      placeholder="Eğitim başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eğitmen</label>
                    <Input
                      value={newTraining.instructor}
                      onChange={(e) => setNewTraining({...newTraining, instructor: e.target.value})}
                      placeholder="Eğitmen adı"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <Textarea
                    value={newTraining.description}
                    onChange={(e) => setNewTraining({...newTraining, description: e.target.value})}
                    placeholder="Eğitim açıklaması"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={newTraining.category}
                      onChange={(e) => setNewTraining({...newTraining, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="technical">Teknik Eğitimler</option>
                      <option value="soft-skills">Yumuşak Beceriler</option>
                      <option value="compliance">Uyum Eğitimleri</option>
                      <option value="leadership">Liderlik</option>
                      <option value="safety">Güvenlik</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                    <Input
                      value={newTraining.duration}
                      onChange={(e) => setNewTraining({...newTraining, duration: e.target.value})}
                      placeholder="2 saat"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk</label>
                    <select
                      value={newTraining.difficulty}
                      onChange={(e) => setNewTraining({...newTraining, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Başlangıç</option>
                      <option value="intermediate">Orta</option>
                      <option value="advanced">İleri</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Opsiyonel)</label>
                  <Input
                    value={newTraining.videoUrl}
                    onChange={(e) => setNewTraining({...newTraining, videoUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim İçeriği</label>
                  <Textarea
                    value={newTraining.content}
                    onChange={(e) => setNewTraining({...newTraining, content: e.target.value})}
                    placeholder="Eğitim detayları ve içeriği"
                    rows={6}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingTraining(false)}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleAddTraining}
                    className="bg-medex-navy hover:bg-medex-blue text-white"
                  >
                    Eğitim Ekle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Training Modal */}
        {editingTraining && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Eğitimi Düzenle</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingTraining(null)}
                  className="h-8 w-8 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim Başlığı</label>
                    <Input
                      value={editingTraining.title}
                      onChange={(e) => setEditingTraining({...editingTraining, title: e.target.value})}
                      placeholder="Eğitim başlığı"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Eğitmen</label>
                    <Input
                      value={editingTraining.instructor}
                      onChange={(e) => setEditingTraining({...editingTraining, instructor: e.target.value})}
                      placeholder="Eğitmen adı"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <Textarea
                    value={editingTraining.description}
                    onChange={(e) => setEditingTraining({...editingTraining, description: e.target.value})}
                    placeholder="Eğitim açıklaması"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={editingTraining.category}
                      onChange={(e) => setEditingTraining({...editingTraining, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="technical">Teknik Eğitimler</option>
                      <option value="soft-skills">Yumuşak Beceriler</option>
                      <option value="compliance">Uyum Eğitimleri</option>
                      <option value="leadership">Liderlik</option>
                      <option value="safety">Güvenlik</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Süre</label>
                    <Input
                      value={editingTraining.duration}
                      onChange={(e) => setEditingTraining({...editingTraining, duration: e.target.value})}
                      placeholder="2 saat"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zorluk</label>
                    <select
                      value={editingTraining.difficulty}
                      onChange={(e) => setEditingTraining({...editingTraining, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="beginner">Başlangıç</option>
                      <option value="intermediate">Orta</option>
                      <option value="advanced">İleri</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Opsiyonel)</label>
                  <Input
                    value={editingTraining.videoUrl || ''}
                    onChange={(e) => setEditingTraining({...editingTraining, videoUrl: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eğitim İçeriği</label>
                  <Textarea
                    value={editingTraining.content}
                    onChange={(e) => setEditingTraining({...editingTraining, content: e.target.value})}
                    placeholder="Eğitim detayları ve içeriği"
                    rows={6}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingTraining(null)}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleUpdateTraining}
                    className="bg-medex-navy hover:bg-medex-blue text-white"
                  >
                    Güncelle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
