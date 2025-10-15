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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  MessageSquare, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

export default function FeedbackPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <FeedbackContent />
    </>
  )
}

function UnauthenticatedFeedback() {
  return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
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

function FeedbackContent() {
  const user = useQuery(api.users.getCurrentUser)
  const feedback = useQuery(api.feedback.getFeedback)
  const addFeedback = useMutation(api.feedback.addFeedback)
  const updateFeedback = useMutation(api.feedback.updateFeedback)
  
  // Mock veriler
  const mockFeedback = [
    {
      _id: 'mock-1',
      title: 'Ofis Sıcaklığı Sorunu',
      content: 'Ofis çok sıcak, klima ayarlarının düzenlenmesi gerekiyor. Çalışma verimliliğimizi etkiliyor.',
      category: 'general',
      priority: 'medium',
      status: 'open',
      author: 'Ayşe Demir',
      createdAt: Date.now() - 86400000 * 2,
      response: undefined
    },
    {
      _id: 'mock-2',
      title: 'IT Sistem Yavaşlığı',
      content: 'Bilgisayar sistemleri çok yavaş çalışıyor. Acil çözüm gerekiyor.',
      category: 'technical',
      priority: 'high',
      status: 'in_progress',
      author: 'Mehmet Kaya',
      createdAt: Date.now() - 86400000 * 5,
      response: 'Sorununuz inceleniyor. En kısa sürede çözüm sağlanacak.'
    },
    {
      _id: 'mock-3',
      title: 'Yemekhane Menü Önerisi',
      content: 'Yemekhane menüsüne daha sağlıklı seçenekler eklenebilir mi?',
      category: 'hr',
      priority: 'low',
      status: 'resolved',
      author: 'Fatma Özkan',
      createdAt: Date.now() - 86400000 * 7,
      response: 'Öneriniz değerlendirildi. Menüye sağlıklı seçenekler eklenecek.'
    },
    {
      _id: 'mock-4',
      title: 'Park Alanı Sorunu',
      content: 'Ofis park alanında yeterli yer yok. Yeni çözümler düşünülebilir mi?',
      category: 'general',
      priority: 'medium',
      status: 'open',
      author: 'Ali Veli',
      createdAt: Date.now() - 86400000 * 10,
      response: undefined
    },
    {
      _id: 'mock-5',
      title: 'Eğitim Programı Önerisi',
      content: 'Dijital pazarlama konusunda eğitim programı düzenlenebilir mi?',
      category: 'hr',
      priority: 'low',
      status: 'closed',
      author: 'Zeynep Ak',
      createdAt: Date.now() - 86400000 * 14,
      response: 'Eğitim programı planlandı. Detaylar yakında paylaşılacak.'
    }
  ]
  
  // Gerçek veriler yoksa mock verileri kullan
  const displayFeedback = feedback && feedback.length > 0 ? feedback : mockFeedback
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isAddingFeedback, setIsAddingFeedback] = useState(false)
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium'
  })

  // Kategoriler
  const categories = [
    { id: 'all', name: 'Tüm Kategoriler' },
    { id: 'general', name: 'Genel' },
    { id: 'technical', name: 'Teknik' },
    { id: 'hr', name: 'İnsan Kaynakları' },
    { id: 'it', name: 'Bilgi İşlem' },
    { id: 'other', name: 'Diğer' }
  ]

  // Durumlar
  const statuses = [
    { id: 'all', name: 'Tüm Durumlar' },
    { id: 'open', name: 'Açık' },
    { id: 'in_progress', name: 'İşlemde' },
    { id: 'resolved', name: 'Çözüldü' },
    { id: 'closed', name: 'Kapalı' }
  ]

  // Filtreleme
  const filteredFeedback = displayFeedback?.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  }) || []

  const handleAddFeedback = async () => {
    if (!newFeedback.title || !newFeedback.content) {
      alert('Lütfen başlık ve içerik alanlarını doldurun')
      return
    }

    try {
      await addFeedback({
        title: newFeedback.title,
        content: newFeedback.content,
        category: newFeedback.category,
        priority: newFeedback.priority as 'low' | 'medium' | 'high'
      })
      
      setNewFeedback({ title: '', content: '', category: 'general', priority: 'medium' })
      setIsAddingFeedback(false)
      alert('Geri bildiriminiz başarıyla gönderildi!')
    } catch (error) {
      console.error('Geri bildirim ekleme hatası:', error)
      alert('Geri bildirim eklenirken bir hata oluştu.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-medex-navy mb-2">Geri Bildirim</h1>
              <p className="text-gray-600">Önerilerinizi ve şikayetlerinizi bizimle paylaşın</p>
            </div>
            <Button 
              onClick={() => setIsAddingFeedback(true)}
              className="text-white"
              style={{ backgroundColor: '#003466' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Geri Bildirim
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Geri bildirim ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="w-4 h-4 mr-2" />
                    {categories.find(c => c.id === selectedCategory)?.name || 'Kategori'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="w-4 h-4 mr-2" />
                    {statuses.find(s => s.id === selectedStatus)?.name || 'Durum'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statuses.map(status => (
                    <DropdownMenuItem 
                      key={status.id}
                      onClick={() => setSelectedStatus(status.id)}
                    >
                      {status.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedback.map((item) => (
            <Card key={item._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{item.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Kategori: {item.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Tarih: {new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    {item.response && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Yanıt:</h4>
                        <p className="text-blue-800">{item.response}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredFeedback.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Geri bildirim bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'Arama kriterlerinize uygun geri bildirim bulunamadı.' 
                    : 'Henüz geri bildirim bulunmuyor.'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Yeni geri bildirim ekleyebilirsiniz</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Feedback Modal */}
        {isAddingFeedback && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAddingFeedback(false)
              }
            }}
          >
            <Card className="w-full max-w-2xl bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Yeni Geri Bildirim</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingFeedback(false)}
                  className="h-8 w-8 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <Input
                    value={newFeedback.title}
                    onChange={(e) => setNewFeedback({...newFeedback, title: e.target.value})}
                    placeholder="Geri bildirim başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                  <Textarea
                    value={newFeedback.content}
                    onChange={(e) => setNewFeedback({...newFeedback, content: e.target.value})}
                    placeholder="Geri bildirim detayları"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback({...newFeedback, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="general">Genel</option>
                      <option value="technical">Teknik</option>
                      <option value="hr">İnsan Kaynakları</option>
                      <option value="it">Bilgi İşlem</option>
                      <option value="other">Diğer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                    <select
                      value={newFeedback.priority}
                      onChange={(e) => setNewFeedback({...newFeedback, priority: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Düşük</option>
                      <option value="medium">Orta</option>
                      <option value="high">Yüksek</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingFeedback(false)}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleAddFeedback}
                    className="text-white"
                    style={{ backgroundColor: '#003466' }}
                  >
                    Gönder
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
