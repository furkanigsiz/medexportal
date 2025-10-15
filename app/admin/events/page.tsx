'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  MapPin,
  Clock
} from 'lucide-react'
import { useState } from 'react'

export default function AdminEventsPage() {
  return (
    <>
      <Authenticated>
        <Navbar />
        <AdminEventsContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-medex-light to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-medex-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold text-medex-navy mb-4">Medex Portal</h1>
            <p className="text-gray-600 mb-8">Şirket içi intranet portalına hoş geldiniz</p>
            <SignInButton mode="modal">
              <Button size="lg" className="bg-medex-navy hover:bg-medex-blue text-white">
                Giriş Yap
              </Button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
    </>
  )
}

function AdminEventsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const events = useQuery(api.events.getEvents)
  const deleteEvent = useMutation(api.events.deleteEvent)

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
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Etkinlik Yönetimi</h1>
          <p className="text-gray-600">Şirket etkinliklerini yönetin ve planlayın</p>
        </div>

        {/* Add Event Button */}
        <div className="mb-6">
          <AddEventDialog />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <Card key={event._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Calendar className="w-5 h-5 text-medex-navy" />
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>Oluşturulma: {new Date(event.createdAt).toLocaleDateString('tr-TR')}</span>
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
                          if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
                            try {
                              await deleteEvent({ eventId: event._id })
                            } catch (error) {
                              console.error('Error deleting event:', error)
                              alert('Etkinlik silinirken bir hata oluştu')
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
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz etkinlik bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk etkinliğinizi eklemek için yukarıdaki butonu kullanın</p>
                <AddEventDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AddEventDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const createEvent = useMutation(api.events.createEvent)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !date.trim() || !location.trim()) return

    try {
      await createEvent({
        title: title.trim(),
        date: date.trim(),
        location: location.trim(),
      })
      setTitle('')
      setDate('')
      setLocation('')
      setOpen(false)
    } catch (error) {
      console.error('Error creating event:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medex-navy hover:bg-medex-blue text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Etkinlik Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Etkinlik Ekle</DialogTitle>
          <DialogDescription>
            Şirket etkinliği oluşturun ve detaylarını belirleyin.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Etkinlik Başlığı
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Etkinlik başlığını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Tarih
            </label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Konum
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Etkinlik konumunu girin..."
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="bg-medex-navy hover:bg-medex-blue text-white">
              Etkinlik Ekle
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
