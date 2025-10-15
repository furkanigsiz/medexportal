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
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Reply,
  Edit,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

export default function AdminTicketsPage() {
  // Geçici olarak authentication devre dışı - direkt content göster
  return (
    <>
      <Navbar />
      <AdminTicketsContent />
    </>
  )
}

function UnauthenticatedAdminTickets() {
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

function AdminTicketsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const tickets = useQuery(api.tickets.getTickets)
  const updateTicketStatus = useMutation(api.tickets.updateTicketStatus)
  const addTicketReply = useMutation(api.tickets.addTicketReply)
  const deleteTicket = useMutation(api.tickets.deleteTicket)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Admin yetkisi kontrolü
  if (user && (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Destek Talepleri Yönetimi</h1>
          <p className="text-gray-600">Tüm destek taleplerini yönetin ve yanıtlayın</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Talep ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
              size="sm"
            >
              Tümü
            </Button>
            <Button
              variant={statusFilter === 'open' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('open')}
              size="sm"
            >
              Açık
            </Button>
            <Button
              variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('in_progress')}
              size="sm"
            >
              İşlemde
            </Button>
            <Button
              variant={statusFilter === 'closed' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('closed')}
              size="sm"
            >
              Kapalı
            </Button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets && filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <AdminTicketCard key={ticket._id} ticket={ticket} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz talep bulunmuyor</h3>
                <p className="text-gray-600">Yeni destek talepleri burada görünecek</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function AdminTicketCard({ ticket }: { ticket: { _id: string; title: string; description: string; status: string; createdAt: number; userId: string; reply?: string; updatedAt: number } }) {
  const [reply, setReply] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const updateTicketStatus = useMutation(api.tickets.updateTicketStatus)
  const addTicketReply = useMutation(api.tickets.addTicketReply)
  const deleteTicket = useMutation(api.tickets.deleteTicket)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Açık'
      case 'in_progress':
        return 'İşlemde'
      case 'closed':
        return 'Kapalı'
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'open':
        return 'destructive'
      case 'in_progress':
        return 'secondary'
      case 'closed':
        return 'outline'
      default:
        return 'default'
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateTicketStatus({
        ticketId: ticket._id as Id<"tickets">,
        status: newStatus as 'open' | 'in_progress' | 'closed',
        reply: reply || undefined
      })
      setReply('')
      setIsReplying(false)
    } catch (error) {
      console.error('Error updating ticket:', error)
    }
  }

  const handleReply = async () => {
    if (!reply.trim()) return
    
    try {
      await addTicketReply({
        ticketId: ticket._id as Id<"tickets">,
        reply: reply.trim()
      })
      setReply('')
      setIsReplying(false)
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  const handleDeleteTicket = async () => {
    if (!confirm('Bu destek talebini silmek istediğinizden emin misiniz?')) return

    try {
      await deleteTicket({ ticketId: ticket._id as Id<"tickets"> })
      alert('Destek talebi başarıyla silindi!')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert('Destek talebi silinirken bir hata oluştu')
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(ticket.status)}
              <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
            </div>
            <p className="text-gray-600 mb-3">{ticket.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Oluşturulma: {new Date(ticket.createdAt).toLocaleDateString('tr-TR')}</span>
              <span>Güncelleme: {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}</span>
            </div>
            {ticket.reply && (
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">Yanıt:</h4>
                <p className="text-gray-700">{ticket.reply}</p>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-col space-y-2">
            <Badge variant={getStatusVariant(ticket.status)}>
              {getStatusText(ticket.status)}
            </Badge>
            
            {/* Admin Actions */}
            <div className="flex space-x-2">
              <Dialog open={isReplying} onOpenChange={setIsReplying}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Reply className="w-4 h-4 mr-1" />
                    Yanıtla
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Talep Yanıtla</DialogTitle>
                    <DialogDescription>
                      Bu destek talebine yanıt verin ve durumunu güncelleyin.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Yanıt
                      </label>
                      <Textarea
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Yanıtınızı yazın..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsReplying(false)}>
                        İptal
                      </Button>
                      <Button 
                        onClick={handleReply}
                        className="bg-medex-navy hover:bg-medex-blue text-white"
                      >
                        Yanıtla
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate('in_progress')}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                      >
                        İşlemde Olarak İşaretle
                      </Button>
                      <Button 
                        onClick={() => handleStatusUpdate('closed')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Kapat
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 hover:text-red-700"
                onClick={handleDeleteTicket}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Sil
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
