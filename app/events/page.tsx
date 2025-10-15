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
import { Input } from '@/components/ui/input'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search,
  Users
} from 'lucide-react'
import { useState } from 'react'

export default function EventsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <EventsContent />
    </>
  )
}

function UnauthenticatedEvents() {
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

function EventsContent() {
  const events = useQuery(api.events.getEvents)
  
  // Mock veriler
  const mockEvents = [
    {
      _id: 'mock-1',
      title: 'Yıllık Şirket Toplantısı',
      date: '2024-02-15',
      location: 'Ana Ofis - Konferans Salonu',
      createdAt: Date.now() - 86400000 * 5
    },
    {
      _id: 'mock-2',
      title: 'IT Güvenlik Eğitimi',
      date: '2024-02-20',
      location: 'Eğitim Salonu A',
      createdAt: Date.now() - 86400000 * 3
    },
    {
      _id: 'mock-3',
      title: 'Takım Building Etkinliği',
      date: '2024-02-25',
      location: 'Spor Salonu',
      createdAt: Date.now() - 86400000 * 7
    },
    {
      _id: 'mock-4',
      title: 'Yeni Ürün Lansmanı',
      date: '2024-03-01',
      location: 'Ana Ofis - Büyük Salon',
      createdAt: Date.now() - 86400000 * 2
    },
    {
      _id: 'mock-5',
      title: 'Çalışan Sağlık Taraması',
      date: '2024-03-05',
      location: 'Sağlık Merkezi',
      createdAt: Date.now() - 86400000 * 10
    }
  ]
  
  // Gerçek veriler yoksa mock verileri kullan
  const displayEvents = events && events.length > 0 ? events : mockEvents
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = displayEvents?.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Tarihe göre sırala (yaklaşan etkinlikler önce)
  const sortedEvents = filteredEvents?.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateA.getTime() - dateB.getTime()
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Şirket Etkinlikleri</h1>
          <p className="text-gray-600">Yaklaşan ve geçmiş etkinlikleri görüntüleyin</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Etkinlik ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {sortedEvents && sortedEvents.length > 0 ? (
            sortedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz etkinlik bulunmuyor</h3>
                <p className="text-gray-600">Yöneticiler etkinlik eklediğinde burada görünecek</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: { _id: string; title: string; date: string; location: string; createdAt: number } }) {
  const eventDate = new Date(event.date)
  const now = new Date()
  const isUpcoming = eventDate >= now
  const isToday = eventDate.toDateString() === now.toDateString()
  const isPast = eventDate < now

  const getEventStatus = () => {
    if (isToday) return { text: 'Bugün', variant: 'default' as const }
    if (isUpcoming) return { text: 'Yaklaşan', variant: 'secondary' as const }
    return { text: 'Geçmiş', variant: 'outline' as const }
  }

  const status = getEventStatus()

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isToday ? 'ring-2 ring-medex-navy' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-medex-blue rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{eventDate.toLocaleDateString('tr-TR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-4">
            <Badge variant={status.variant}>
              {status.text}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
