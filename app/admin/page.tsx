'use client'

// Geçici olarak authentication devre dışı
// import { Authenticated, Unauthenticated } from 'convex/react'
// import { SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Users, 
  FileText, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Shield,
  BarChart3,
  BookOpen,
  Video
} from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminContent />
    </>
  )
}

function UnauthenticatedAdmin() {
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

function AdminContent() {
  const user = useQuery(api.users.getCurrentUser)
  const users = useQuery(api.users.getAllUsers)
  const news = useQuery(api.news.getNews)
  const events = useQuery(api.events.getEvents)
  const tickets = useQuery(api.tickets.getTickets)
  const documents = useQuery(api.documents.getDocuments)
  const meetings = useQuery(api.meetings.getMeetings, {})

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

  const stats = {
    totalUsers: users?.length || 0,
    totalNews: news?.length || 0,
    totalEvents: events?.length || 0,
    openTickets: tickets?.filter(t => t.status === 'open').length || 0,
    totalTickets: tickets?.length || 0,
    totalDocuments: documents?.length || 0,
    totalMeetings: meetings?.length || 0,
    ongoingMeetings: meetings?.filter(m => m.status === 'ongoing').length || 0,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Yönetim Paneli</h1>
          <p className="text-gray-600">Sistem yönetimi ve içerik kontrolü</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-white" />
                <CardTitle className="text-lg text-white">Kullanıcılar</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-sm text-gray-200">Toplam kullanıcı</p>
            </CardContent>
          </Card>

          <Card className="border-red-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-white" />
                <CardTitle className="text-lg text-white">Açık Talepler</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.openTickets}</div>
              <p className="text-sm text-gray-200">Toplam {stats.totalTickets} talep</p>
            </CardContent>
          </Card>

          <Card className="border-green-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-white" />
                <CardTitle className="text-lg text-white">Dökümanlar</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalDocuments}</div>
              <p className="text-sm text-gray-200">Toplam döküman</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200" style={{ backgroundColor: '#003466' }}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Video className="w-5 h-5 text-white" />
                <CardTitle className="text-lg text-white">Toplantılar</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalMeetings}</div>
              <p className="text-sm text-gray-200">{stats.ongoingMeetings} devam ediyor</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-medex-navy" />
                <span>İçerik Yönetimi</span>
              </CardTitle>
              <CardDescription>Duyurular, etkinlikler ve dökümanları yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/news">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Duyuruları Yönet ({stats.totalNews})
                </Button>
              </Link>
              <Link href="/admin/events">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Etkinlikleri Yönet ({stats.totalEvents})
                </Button>
              </Link>
              <Link href="/admin/documents">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  Dökümanları Yönet ({stats.totalDocuments})
                </Button>
              </Link>
              <Link href="/admin/sop">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <FileText className="w-4 h-4 mr-2" />
                  SOP Yönetimi
                </Button>
              </Link>
            <Link href="/admin/feedback">
              <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Geri Bildirim Yönetimi
              </Button>
            </Link>
            <Link href="/admin/trainings">
              <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                <BookOpen className="w-4 h-4 mr-2" />
                Eğitim Yönetimi
              </Button>
            </Link>
            <Link href="/admin/meetings">
              <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                <Video className="w-4 h-4 mr-2" />
                Toplantı Yönetimi ({stats.totalMeetings})
              </Button>
            </Link>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-medex-navy" />
                <span>Kullanıcı Yönetimi</span>
              </CardTitle>
              <CardDescription>Kullanıcı rolleri ve yetkilerini yönetin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <Users className="w-4 h-4 mr-2" />
                  Kullanıcıları Yönet ({stats.totalUsers})
                </Button>
              </Link>
              <Link href="/admin/tickets">
                <Button variant="outline" className="w-full justify-start hover:bg-blue-600 hover:text-white transition-colors" style={{ borderColor: '#003466', color: '#003466' }}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Destek Taleplerini Yönet ({stats.totalTickets})
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-medex-navy" />
              <span>Son Aktiviteler</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets && tickets.slice(0, 5).map((ticket) => (
                <div key={ticket._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{ticket.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      ticket.status === 'open' ? 'destructive' : 
                      ticket.status === 'in_progress' ? 'secondary' : 
                      'outline'
                    }
                  >
                    {ticket.status === 'open' ? 'Açık' : 
                     ticket.status === 'in_progress' ? 'İşlemde' : 
                     'Kapalı'}
                  </Badge>
                </div>
              ))}
              {(!tickets || tickets.length === 0) && (
                <p className="text-gray-500 text-center py-4">Henüz aktivite bulunmuyor</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
