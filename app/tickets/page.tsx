'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search
} from 'lucide-react'
import { useState } from 'react'

export default function TicketsPage() {
  return (
    <>
      <Authenticated>
        <Navbar />
        <TicketsContent />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
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

function TicketsContent() {
  const user = useQuery(api.users.getCurrentUser)
  const tickets = useQuery(api.tickets.getTickets)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Destek Talepleri</h1>
          <p className="text-gray-600">Teknik destek ve yardım taleplerinizi buradan yönetebilirsiniz</p>
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

        {/* Create Ticket Button */}
        <div className="mb-6">
          <CreateTicketDialog />
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets && filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <TicketCard key={ticket._id} ticket={ticket} user={user} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz talep bulunmuyor</h3>
                <p className="text-gray-600 mb-4">İlk destek talebinizi oluşturmak için yukarıdaki butonu kullanın</p>
                <CreateTicketDialog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function TicketCard({ ticket, user }: { ticket: any, user: any }) {
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
          <div className="ml-4">
            <Badge variant={getStatusVariant(ticket.status)}>
              {getStatusText(ticket.status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CreateTicketDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const createTicket = useMutation(api.tickets.createTicket)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    try {
      await createTicket({
        title: title.trim(),
        description: description.trim(),
      })
      setTitle('')
      setDescription('')
      setOpen(false)
    } catch (error) {
      console.error('Error creating ticket:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medex-navy hover:bg-medex-blue text-white">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Talep Oluştur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yeni Destek Talebi</DialogTitle>
          <DialogDescription>
            Teknik destek veya yardım talebinizi oluşturun. Mümkün olduğunca detaylı açıklama yapın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Başlık
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Talep başlığını girin..."
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Sorununuzu detaylı olarak açıklayın..."
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              İptal
            </Button>
            <Button type="submit" className="bg-medex-navy hover:bg-medex-blue text-white">
              Talep Oluştur
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
