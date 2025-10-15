'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Play, 
  Plus, 
  Search,
  Clock,
  User,
  BookOpen,
  Download,
  Eye,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

export default function TrainingsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <TrainingsContent />
    </>
  )
}

function UnauthenticatedTrainings() {
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

function TrainingsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const trainings = useQuery(api.trainings.getTrainings)
  const addTraining = useMutation(api.trainings.addTraining)
  
  // Mock veriler
  const mockTrainings = [
    {
      _id: 'mock-1',
      title: 'Proje Yönetimi Temelleri',
      description: 'Proje yönetiminin temel prensipleri ve metodolojileri hakkında kapsamlı eğitim',
      content: 'Bu eğitimde proje yönetiminin temel kavramları, proje yaşam döngüsü, risk yönetimi ve ekip yönetimi konuları ele alınacak.',
      category: 'technical',
      duration: '4 saat',
      difficulty: 'beginner',
      instructor: 'Ahmet Yılmaz',
      videoUrl: 'https://youtube.com/watch?v=example1',
      materials: ['Proje Yönetimi Rehberi', 'Risk Analizi Şablonu'],
      createdAt: Date.now() - 86400000 * 5
    },
    {
      _id: 'mock-2',
      title: 'Liderlik Becerileri',
      description: 'Etkili liderlik ve takım yönetimi becerileri',
      content: 'Liderlik stilleri, motivasyon teknikleri, çatışma yönetimi ve etkili iletişim konularında pratik eğitim.',
      category: 'soft-skills',
      duration: '6 saat',
      difficulty: 'intermediate',
      instructor: 'Ayşe Demir',
      videoUrl: 'https://youtube.com/watch?v=example2',
      materials: ['Liderlik Değerlendirme Formu', 'Takım Dinamikleri Rehberi'],
      createdAt: Date.now() - 86400000 * 7
    },
    {
      _id: 'mock-3',
      title: 'Güvenlik Protokolleri',
      description: 'İş güvenliği ve acil durum prosedürleri',
      content: 'İş yerinde güvenlik, acil durum müdahale, yangın güvenliği ve kişisel koruyucu ekipman kullanımı.',
      category: 'safety',
      duration: '3 saat',
      difficulty: 'beginner',
      instructor: 'Güvenlik Departmanı',
      videoUrl: undefined,
      materials: ['Güvenlik El Kitabı', 'Acil Durum Planı'],
      createdAt: Date.now() - 86400000 * 10
    },
    {
      _id: 'mock-4',
      title: 'Dijital Dönüşüm Stratejileri',
      description: 'Kurumsal dijital dönüşüm süreçleri ve stratejileri',
      content: 'Dijital teknolojilerin iş süreçlerine entegrasyonu, veri analizi ve dijital pazarlama stratejileri.',
      category: 'technical',
      duration: '8 saat',
      difficulty: 'advanced',
      instructor: 'Dr. Mehmet Kaya',
      videoUrl: 'https://youtube.com/watch?v=example4',
      materials: ['Dijital Dönüşüm Çerçevesi', 'Teknoloji Trendleri Raporu'],
      createdAt: Date.now() - 86400000 * 3
    },
    {
      _id: 'mock-5',
      title: 'Müşteri Hizmetleri Mükemmelliği',
      description: 'Üstün müşteri deneyimi yaratma teknikleri',
      content: 'Müşteri beklentilerini anlama, etkili iletişim, sorun çözme ve müşteri memnuniyeti artırma yöntemleri.',
      category: 'soft-skills',
      duration: '5 saat',
      difficulty: 'intermediate',
      instructor: 'Zeynep Ak',
      videoUrl: 'https://youtube.com/watch?v=example5',
      materials: ['Müşteri Hizmetleri Rehberi', 'İletişim Teknikleri'],
      createdAt: Date.now() - 86400000 * 14
    }
  ]
  
  // Gerçek veriler yoksa mock verileri kullan
  const displayTrainings = trainings && trainings.length > 0 ? trainings : mockTrainings
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isAddingTraining, setIsAddingTraining] = useState(false)
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

  // Zorluk seviyeleri
  const difficulties = [
    { id: 'all', name: 'Tüm Seviyeler' },
    { id: 'beginner', name: 'Başlangıç' },
    { id: 'intermediate', name: 'Orta' },
    { id: 'advanced', name: 'İleri' }
  ]

  // Filtreleme
  const filteredTrainings = displayTrainings?.filter(training => {
    const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         training.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || training.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || training.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
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
              <h1 className="text-3xl font-bold text-medex-navy mb-2">Eğitimler</h1>
              <p className="text-gray-600">Profesyonel gelişim için eğitim materyalleri</p>
            </div>
            {user && (user.role === 'admin' || user.role === 'superadmin') && (
              <Button 
                onClick={() => setIsAddingTraining(true)}
                className="text-white"
                style={{ backgroundColor: '#003466' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Eğitim Ekle
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Eğitim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Trainings List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <Card key={training._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{training.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{training.description}</p>
                  </div>
                  {training.videoUrl && (
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center ml-2">
                      <Play className="w-6 h-6 text-red-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{training.instructor}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{training.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 capitalize">{training.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(training.difficulty)}>
                    {getDifficultyText(training.difficulty)}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Görüntüle
                    </Button>
                    {training.materials && training.materials.length > 0 && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        İndir
                      </Button>
                    )}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                  ? 'Arama kriterlerinize uygun eğitim bulunamadı.' 
                  : 'Henüz eğitim bulunmuyor.'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                  ? 'Farklı arama kriterleri deneyin.' 
                  : 'Admin panelinden eğitim ekleyebilirsiniz.'}
              </p>
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
      </div>
    </div>
  )
}
