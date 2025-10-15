'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Navbar from '@/components/Navbar'
import UserInitializer from '@/components/UserInitializer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Star,
  Clock,
  ArrowRight,
  Search,
  Folder,
  BookOpen,
  Headphones,
  MessageCircle,
  HelpCircle,
  Play,
  Building,
  Award,
  UserPlus,
  Newspaper,
  Bell,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  return (
    <>
      <Authenticated>
        <UserInitializer />
        <Navbar />
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-medex-navy via-medex-dark to-medex-navy flex items-center justify-center p-4 relative overflow-hidden">
          {/* Arka plan deseni */}
          <div className="absolute inset-0 bg-gradient-to-br from-medex-navy/90 to-medex-dark/90"></div>
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="text-center max-w-4xl w-full relative z-10">
            {/* Logo */}
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 mb-6">
                <span className="text-4xl font-bold text-medex-red">MED</span>
                <span className="text-4xl font-bold text-white">EX</span>
              </div>
            </div>
            
            {/* Ana slogan */}
            <div className="mb-12">
              <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                Klinik Araştırmalar ve Sağlık Teknolojilerinde
              </h1>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Güvenilir Çözüm Ortağınız
              </h2>
              <p className="text-xl text-white/90 mb-8">Şirket içi intranet portalına hoş geldiniz</p>
            </div>
            
            {/* İstatistik kartları */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-medex-navy">338+</div>
                <div className="text-sm text-medex-navy">Profesyonel Çalışan</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-medex-navy">10+</div>
                <div className="text-sm text-medex-navy">Yıllık Deneyim</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-medex-navy">338+</div>
                <div className="text-sm text-medex-navy">Başarılı Proje</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-medex-navy">%84+</div>
                <div className="text-sm text-medex-navy">Kalite Odaklı</div>
              </div>
            </div>
            
            {/* Giriş butonları */}
            <div className="space-y-4 max-w-md mx-auto">
              <a 
                href="/sign-in" 
                className="block bg-medex-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full text-center"
              >
                Giriş Yap
              </a>
              
              <a 
                href="/sign-up" 
                className="block bg-white hover:bg-white text-medex-navy font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-white w-full text-center"
              >
                Kayıt Ol
              </a>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}

function Dashboard() {
  const user = useQuery(api.users.getCurrentUser)
  const news = useQuery(api.news.getNews)
  const events = useQuery(api.events.getEvents)
  const tickets = useQuery(api.tickets.getTickets)
  const newJoiners = useQuery(api.newJoiners.getNewJoiners)
  const successStories = useQuery(api.successStories.getFeaturedSuccessStories)
  const departmentNotifications = useQuery(api.departmentNotifications.getDepartmentNotifications)
  const medexPerspective = useQuery(api.medexPerspective.getMedexPerspective)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  const currentHour = new Date().getHours()
  const greeting = currentHour < 6 ? 'İyi geceler' : currentHour < 12 ? 'Günaydın' : currentHour < 18 ? 'İyi günler' : 'İyi akşamlar'

  // Sayfa yüklendiğinde sonuçları temizle
  useEffect(() => {
    setSearchResults([])
  }, [])

  const performSearch = (term: string) => {
    // Eğer arama terimi boşsa, sonuçları temizle
    if (term.length === 0) {
      setSearchResults([])
      return
    }

    const results: any[] = []
    
    // Arama terimi varsa filtrele
    // Haberlerde arama
    if (news) {
      news.forEach(item => {
        if (item.title.toLowerCase().includes(term) || item.content.toLowerCase().includes(term)) {
          results.push({ type: 'news', item, title: item.title, content: item.content })
        }
      })
    }

    // Etkinliklerde arama
    if (events) {
      events.forEach(item => {
        if (item.title.toLowerCase().includes(term) || item.location.toLowerCase().includes(term)) {
          results.push({ type: 'event', item, title: item.title, content: item.location })
        }
      })
    }

    // Destek taleplerinde arama
    if (tickets) {
      tickets.forEach(item => {
        if (item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)) {
          results.push({ type: 'ticket', item, title: item.title, content: item.description })
        }
      })
    }

    setSearchResults(results)
  }

  // Kullanıcı yüklenene kadar bekle
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Kullanıcı bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Kullanıcı yoksa (null) - bu durumda Clerk'te giriş yapmış ama Convex'te kullanıcı yok
  if (user === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h1>
          <p className="text-gray-600 mb-6">Hesabınız oluşturuluyor...</p>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Bu işlem birkaç saniye sürebilir...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {greeting}, {user?.name?.split(' ')[0] || 'Kullanıcı'}!
          </h1>
          <p className="text-xl text-gray-600 mb-6">Intranete Hoş Geldiniz</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tüm ağda ara..."
                value={searchTerm}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ borderColor: '#003466' }}
                onFocus={(e) => e.target.style.borderColor = '#003466'}
                onBlur={(e) => e.target.style.borderColor = '#003466'}
                onChange={(e) => {
                  const term = e.target.value
                  setSearchTerm(term)
                  performSearch(term)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    if (searchTerm.length > 2) {
                      performSearch(searchTerm)
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Arama Sonuçları ({searchResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          {result.type === 'news' && <Newspaper className="w-4 h-4 text-blue-600" />}
                          {result.type === 'event' && <Calendar className="w-4 h-4 text-green-600" />}
                          {result.type === 'ticket' && <MessageSquare className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{result.title}</h3>
                          <p className="text-sm text-gray-600">{result.content}</p>
                          <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {result.type === 'news' ? 'Haber' : result.type === 'event' ? 'Etkinlik' : 'Destek Talebi'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Aylık Bülten */}
            <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Aylık Bülten</CardTitle>
              </CardHeader>
              <CardContent>
                {news && news.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {news.slice(0, 3).map((item, index) => (
                      <div key={item._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className={`aspect-video rounded-lg mb-3 flex items-center justify-center ${
                          index === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                          index === 1 ? 'bg-gradient-to-br from-green-100 to-green-200' :
                          'bg-gradient-to-br from-red-100 to-red-200'
                        }`}>
                          {index === 0 ? <Building className="w-12 h-12 text-blue-600" /> :
                           index === 1 ? <Users className="w-12 h-12 text-green-600" /> :
                           <MessageSquare className="w-12 h-12 text-red-600" />}
                          {index === 2 && <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">MUST READ</Badge>}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>By {user?.name || 'Admin'}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-white">Henüz haber bulunmuyor</p>
                    <p className="text-sm text-gray-200 mt-2">Admin panelinden haber ekleyebilirsiniz</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Yaklaşan Etkinlikler */}
            <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Yaklaşan Etkinlikler</CardTitle>
              </CardHeader>
              <CardContent>
                {events && events.length > 0 ? (
                  <div className="space-y-4">
                    {events.slice(0, 4).map((event) => (
                      <div key={event._id} className="flex items-center space-x-4 p-3 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.date}
                        </div>
                      </div>
                    ))}
                    <Link href="/events">
                      <Button variant="outline" className="w-full">
                        View More &gt;
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-white">Henüz etkinlik bulunmuyor</p>
                    <p className="text-sm text-gray-200 mt-2">Admin panelinden etkinlik ekleyebilirsiniz</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Haftalık Bildirimler */}
            <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Haftalık Bildirimler</CardTitle>
              </CardHeader>
              <CardContent>
                {departmentNotifications && departmentNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {departmentNotifications.slice(0, 4).map((notification) => (
                      <div key={notification._id} className="flex items-start space-x-3 p-3 hover:bg-white rounded-lg cursor-pointer">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          notification.department === 'Company Announcements' ? 'bg-blue-100' :
                          notification.department === 'Human Resources' ? 'bg-green-100' :
                          notification.department === 'Information Technology' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {notification.department === 'Company Announcements' ? <Newspaper className="w-5 h-5 text-blue-600" /> :
                           notification.department === 'Human Resources' ? <Users className="w-5 h-5 text-green-600" /> :
                           notification.department === 'Information Technology' ? <Building className="w-5 h-5 text-purple-600" /> :
                           <Building className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                        </div>
                      </div>
                    ))}
                    <Link href="/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View all spaces &gt;
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-white">Henüz bildirim bulunmuyor</p>
                    <p className="text-sm text-gray-200 mt-2">Admin panelinden bildirim ekleyebilirsiniz</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hızlı Erişim */}
            <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Hızlı Erişim</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Link href="/documents" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                      <Folder className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-white">Dökümanlar</span>
                  </Link>
                  
                  <Link href="/sop" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-white">SOP</span>
                  </Link>
                  
                  <Link href="/tickets" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                      <Headphones className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-white">IT Destek</span>
                  </Link>
                  
                  <Link href="/forum" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                      <MessageCircle className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-white">FORUM</span>
                  </Link>
                  
                  <Link href="/feedback" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2">
                      <HelpCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-white">Geri Bildirim</span>
                  </Link>
                  
                  <Link href="/trainings" className="flex flex-col items-center p-4 hover:bg-white rounded-lg transition-colors">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-2">
                      <Play className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-white">Eğitimler</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Aramıza Katılanlar */}
          <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Aramıza Katılanlar</CardTitle>
            </CardHeader>
            <CardContent>
              {newJoiners && newJoiners.length > 0 ? (
                <div className="space-y-4">
                  {newJoiners.slice(0, 3).map((joiner) => (
                    <div key={joiner._id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {joiner.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{joiner.name}</h3>
                        <p className="text-sm text-gray-600">{joiner.position}</p>
                        <p className="text-xs text-gray-500">{joiner.location}</p>
                      </div>
                      <div className="text-xs text-gray-500">{joiner.joinDate}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz yeni çalışan bulunmuyor</p>
                  <p className="text-sm text-gray-400 mt-2">Admin panelinden yeni çalışan ekleyebilirsiniz</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Başarı Hikâyeleri */}
          <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Başarı Hikâyeleri</CardTitle>
              <p className="text-sm text-gray-200">Ekibimizin başarı yolculuğunu keşfedin.</p>
            </CardHeader>
            <CardContent>
              {successStories && successStories.length > 0 ? (
                <div className="space-y-4">
                  {successStories.slice(0, 2).map((story) => (
                    <div key={story._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3 mb-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold text-gray-900">{story.title}</h3>
                        {story.featured && <Badge className="bg-red-500 text-white text-xs">MUST READ</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{story.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>By {story.author}</span>
                        <span>{story.publishDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz başarı hikayesi bulunmuyor</p>
                  <p className="text-sm text-gray-400 mt-2">Admin panelinden başarı hikayesi ekleyebilirsiniz</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medex Perspektifi */}
          <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Medex Perspektifi: Geleceğe Bakışımız</CardTitle>
            </CardHeader>
            <CardContent>
              {medexPerspective && medexPerspective.length > 0 ? (
                <div className="space-y-4">
                  {medexPerspective.slice(0, 1).map((perspective) => (
                    <div key={perspective._id} className="space-y-3">
                      <h3 className="font-semibold text-gray-900">{perspective.title}</h3>
                      <p className="text-sm text-gray-600">{perspective.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{perspective.publishDate}</span>
                        <span>{new Date(perspective.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz perspektif makalesi bulunmuyor</p>
                  <p className="text-sm text-gray-400 mt-2">Admin panelinden perspektif makalesi ekleyebilirsiniz</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
