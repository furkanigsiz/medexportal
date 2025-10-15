'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  MessageCircle, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  MessageSquare,
  ThumbsUp,
  Reply,
  Pin,
  Star,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ForumPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <ForumContent />
    </>
  )
}

function UnauthenticatedForum() {
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

function ForumContent() {
  const topics = useQuery(api.forum.getForumTopics)
  const addTopic = useMutation(api.forum.addForumTopic)
  
  // Mock veriler
  const mockTopics = [
    {
      _id: 'mock-1',
      title: 'Yeni Ofis Düzenlemesi Hakkında',
      content: 'Yeni ofis düzenlemesi ile ilgili görüşlerinizi paylaşabilir misiniz? Hangi alanların iyileştirilmesi gerekiyor?',
      category: 'general',
      author: 'Ahmet Yılmaz',
      createdAt: Date.now() - 86400000 * 2,
      replies: 5,
      views: 23,
      likes: 8,
      isPinned: false,
      isHot: false,
      tags: ['ofis', 'düzenleme']
    },
    {
      _id: 'mock-2',
      title: 'IT Sistem Güncellemeleri',
      content: 'Bu hafta yapılacak sistem güncellemeleri hakkında bilgi paylaşımı. Sorularınızı burada sorabilirsiniz.',
      category: 'technical',
      author: 'IT Departmanı',
      createdAt: Date.now() - 86400000 * 5,
      replies: 8,
      views: 45,
      likes: 15,
      isPinned: true,
      isHot: true,
      tags: ['sistem', 'güncelleme', 'IT']
    },
    {
      _id: 'mock-3',
      title: 'Çalışan Etkinlik Önerileri',
      content: 'Bu ay düzenlenecek çalışan etkinlikleri için önerilerinizi bekliyoruz. Hangi aktiviteleri tercih edersiniz?',
      category: 'hr',
      author: 'İK Departmanı',
      createdAt: Date.now() - 86400000 * 7,
      replies: 12,
      views: 67,
      likes: 22,
      isPinned: false,
      isHot: true,
      tags: ['etkinlik', 'çalışan', 'sosyal']
    },
    {
      _id: 'mock-4',
      title: 'Proje Yönetimi Araçları',
      content: 'Hangi proje yönetimi araçlarını kullanıyorsunuz? Deneyimlerinizi paylaşır mısınız?',
      category: 'technical',
      author: 'Proje Yöneticisi',
      createdAt: Date.now() - 86400000 * 10,
      replies: 6,
      views: 34,
      likes: 4,
      isPinned: false,
      isHot: false,
      tags: ['proje', 'yönetim', 'araç']
    },
    {
      _id: 'mock-5',
      title: 'Uzaktan Çalışma Deneyimleri',
      content: 'Uzaktan çalışma sürecindeki deneyimlerinizi ve önerilerinizi paylaşabilir misiniz?',
      category: 'general',
      author: 'Mehmet Kaya',
      createdAt: Date.now() - 86400000 * 14,
      replies: 15,
      views: 89,
      likes: 31,
      isPinned: false,
      isHot: true,
      tags: ['uzaktan', 'çalışma', 'deneyim']
    }
  ]
  
  // Gerçek veriler yoksa mock verileri kullan
  const displayTopics = topics && topics.length > 0 ? topics : mockTopics
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [] as string[]
  })

  // Forum kategorileri
  const forumCategories = [
    { id: 'all', name: 'Tüm Kategoriler', count: displayTopics?.length || 0 },
    { id: 'general', name: 'Genel Tartışma', count: displayTopics?.filter(t => t.category === 'general').length || 0 },
    { id: 'technical', name: 'Teknik Destek', count: displayTopics?.filter(t => t.category === 'technical').length || 0 },
    { id: 'hr', name: 'İnsan Kaynakları', count: displayTopics?.filter(t => t.category === 'hr').length || 0 },
    { id: 'announcements', name: 'Duyurular', count: displayTopics?.filter(t => t.category === 'announcements').length || 0 },
    { id: 'suggestions', name: 'Öneriler', count: displayTopics?.filter(t => t.category === 'suggestions').length || 0 },
  ]

  // Filtreleme
  const filteredTopics = displayTopics?.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  const handleAddTopic = async () => {
    if (!newTopic.title || !newTopic.content) {
      alert('Lütfen başlık ve içerik alanlarını doldurun')
      return
    }

    try {
      await addTopic({
        title: newTopic.title,
        content: newTopic.content,
        category: newTopic.category,
        tags: newTopic.tags
      })
      
      setNewTopic({ title: '', content: '', category: 'general', tags: [] })
      setIsAddingTopic(false)
      alert('Konu başarıyla oluşturuldu!')
    } catch (error) {
      console.error('Konu ekleme hatası:', error)
      alert('Konu eklenirken bir hata oluştu.')
    }
  }

  const getCategoryName = (categoryId: string) => {
    return forumCategories.find(cat => cat.id === categoryId)?.name || 'Bilinmeyen'
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'technical': return 'bg-green-100 text-green-800'
      case 'hr': return 'bg-purple-100 text-purple-800'
      case 'announcements': return 'bg-red-100 text-red-800'
      case 'suggestions': return 'bg-yellow-100 text-yellow-800'
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
              <h1 className="text-3xl font-bold text-medex-navy mb-2">Forum</h1>
              <p className="text-gray-600">Şirket içi tartışmalar ve bilgi paylaşımı</p>
            </div>
            <Button 
              onClick={() => setIsAddingTopic(true)}
              className="text-white"
              style={{ backgroundColor: '#003466' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Konu
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Forum konularında ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-between">
                    <Filter className="w-4 h-4 mr-2" />
                    {forumCategories.find(c => c.id === selectedCategory)?.name || 'Kategori'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {forumCategories.map(category => (
                    <DropdownMenuItem 
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Forum Topics */}
        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card key={topic._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {topic.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                      <h3 className="text-xl font-semibold text-gray-900">{topic.title}</h3>
                      <Badge className={getCategoryColor(topic.category)}>
                        {getCategoryName(topic.category)}
                      </Badge>
                      {topic.isHot && (
                        <Badge className="bg-red-100 text-red-800">
                          <Star className="w-3 h-3 mr-1" />
                          Popüler
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">{topic.content}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{topic.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{topic.replies} yanıt</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{topic.views} görüntüleme</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{topic.likes} beğeni</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(topic.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    {topic.tags && topic.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {topic.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Reply className="w-4 h-4 mr-2" />
                      Yanıtla
                    </Button>
                    <Button size="sm" className="text-white" style={{ backgroundColor: '#003466' }}>
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Beğen
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredTopics.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Forum konusu bulunamadı</h3>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Arama kriterlerinize uygun konu bulunamadı.' 
                    : 'Henüz forum konusu bulunmuyor.'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Yeni konu ekleyebilirsiniz</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add Topic Modal */}
        {isAddingTopic && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAddingTopic(false)
              }
            }}
          >
            <Card className="w-full max-w-2xl bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Yeni Forum Konusu</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingTopic(false)}
                  className="h-8 w-8 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                  <Input
                    value={newTopic.title}
                    onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                    placeholder="Konu başlığı"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                  <Textarea
                    value={newTopic.content}
                    onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                    placeholder="Konu içeriği"
                    rows={6}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <select
                      value={newTopic.category}
                      onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="general">Genel Tartışma</option>
                      <option value="technical">Teknik Destek</option>
                      <option value="hr">İnsan Kaynakları</option>
                      <option value="announcements">Duyurular</option>
                      <option value="suggestions">Öneriler</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Etiketler (virgülle ayırın)</label>
                    <Input
                      value={newTopic.tags.join(', ')}
                      onChange={(e) => setNewTopic({...newTopic, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                      placeholder="etiket1, etiket2, etiket3"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingTopic(false)}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={handleAddTopic}
                    className="text-white"
                    style={{ backgroundColor: '#003466' }}
                  >
                    Oluştur
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