'use client'

import { Authenticated, Unauthenticated } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2,
  Shield,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useState } from 'react'

export default function AdminFeedbackPage() {
  return (
    <>
      <Authenticated>
        <Navbar />
        <AdminFeedbackContent />
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

function AdminFeedbackContent() {
  const user = useQuery(api.users.getCurrentUser)
  const feedback = useQuery(api.feedback.getFeedback)
  const updateFeedback = useMutation(api.feedback.updateFeedback)
  const deleteFeedback = useMutation(api.feedback.deleteFeedback)
  
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')

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

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      await updateFeedback({
        id: feedbackId as Id<"feedback">,
        status: newStatus as 'open' | 'in_progress' | 'resolved' | 'closed'
      })
    } catch (error) {
      console.error('Error updating feedback status:', error)
    }
  }

  const handleResponse = async (feedbackId: string) => {
    if (!responseText.trim()) {
      alert('Lütfen yanıt metnini girin')
      return
    }

    try {
      await updateFeedback({
        id: feedbackId as Id<"feedback">,
        response: responseText.trim()
      })
      setResponseText('')
      setRespondingTo(null)
      alert('Yanıt başarıyla gönderildi!')
    } catch (error) {
      console.error('Error sending response:', error)
      alert('Yanıt gönderilirken bir hata oluştu')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medex-navy mb-2">Geri Bildirim Yönetimi</h1>
          <p className="text-gray-600">Kullanıcı geri bildirimlerini yönetin ve yanıtlayın</p>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {feedback && feedback.length > 0 ? (
            feedback.map((item) => (
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
                    <div className="ml-4 flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(item._id, 'in_progress')}
                          disabled={item.status === 'in_progress'}
                        >
                          İşlemde
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(item._id, 'resolved')}
                          disabled={item.status === 'resolved'}
                        >
                          Çözüldü
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusUpdate(item._id, 'closed')}
                          disabled={item.status === 'closed'}
                        >
                          Kapalı
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setRespondingTo(item._id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Yanıtla
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={async () => {
                            if (confirm('Bu geri bildirimi silmek istediğinizden emin misiniz?')) {
                              try {
                                await deleteFeedback({ feedbackId: item._id as Id<"feedback"> })
                                alert('Geri bildirim başarıyla silindi!')
                              } catch (error) {
                                console.error('Error deleting feedback:', error)
                                alert('Geri bildirim silinirken bir hata oluştu')
                              }
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Sil
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz geri bildirim bulunmuyor</h3>
                <p className="text-gray-600">Kullanıcılar geri bildirim gönderdiğinde burada görünecek</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Response Modal */}
        {respondingTo && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Geri Bildirime Yanıt Ver</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRespondingTo(null)
                    setResponseText('')
                  }}
                  className="h-8 w-8 p-0"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yanıt Metni
                  </label>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Geri bildirime yanıtınızı yazın..."
                    rows={6}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRespondingTo(null)
                      setResponseText('')
                    }}
                  >
                    İptal
                  </Button>
                  <Button 
                    onClick={() => handleResponse(respondingTo)}
                    className="bg-medex-navy hover:bg-medex-blue text-white"
                  >
                    Yanıt Gönder
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
