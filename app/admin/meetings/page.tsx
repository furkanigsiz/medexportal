'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Video, 
  Calendar, 
  Users, 
  Clock, 
  Trash2, 
  Eye,
  Plus,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useState } from 'react'
import { Id } from '../../../convex/_generated/dataModel'

export default function AdminMeetingsPage() {
  const currentUser = useQuery(api.users.getCurrentUser)
  const meetings = useQuery(api.meetings.getMeetings)
  const deleteMeeting = useMutation(api.meetings.deleteMeeting)
  const updateMeetingStatus = useMutation(api.meetings.updateMeetingStatus)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDeleteMeeting = async (meetingId: string) => {
    if (confirm('Bu toplantıyı silmek istediğinizden emin misiniz?')) {
      setDeletingId(meetingId)
      try {
        await deleteMeeting({ meetingId: meetingId as Id<"meetings"> })
      } catch (error) {
        console.error('Toplantı silinirken hata:', error)
        alert('Toplantı silinirken bir hata oluştu.')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleUpdateStatus = async (meetingId: string, status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled') => {
    try {
      await updateMeetingStatus({ 
        meetingId: meetingId as Id<"meetings">, 
        status 
      })
    } catch (error) {
      console.error('Toplantı durumu güncellenirken hata:', error)
      alert('Toplantı durumu güncellenirken bir hata oluştu.')
    }
  }

  // Admin yetkisi kontrolü
  if (currentUser && (currentUser.role !== 'admin' && currentUser.role !== 'superadmin')) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Yetkisiz Erişim</h2>
          <p className="text-gray-600 mb-4">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
          <Link href="/meetings">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Toplantılar'a Dön
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Yönetim Paneli
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Toplantı Yönetimi</h1>
                <p className="text-gray-600 mt-2">Tüm toplantıları görüntüleyin ve yönetin</p>
              </div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/meetings/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Toplantı
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Toplam</p>
                    <p className="text-2xl font-bold text-gray-900">{meetings?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Planlandı</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {meetings?.filter(m => m.status === 'scheduled').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Video className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Devam Ediyor</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {meetings?.filter(m => m.status === 'ongoing').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-gray-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Tamamlandı</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {meetings?.filter(m => m.status === 'completed').length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Meetings List */}
          <Card>
            <CardHeader>
              <CardTitle>Tüm Toplantılar</CardTitle>
            </CardHeader>
            <CardContent>
              {meetings && meetings.length > 0 ? (
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <div key={meeting._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                            <Badge variant={
                              meeting.status === 'scheduled' ? 'default' :
                              meeting.status === 'ongoing' ? 'destructive' :
                              meeting.status === 'completed' ? 'secondary' : 'outline'
                            }>
                              {meeting.status === 'scheduled' ? 'Planlandı' :
                               meeting.status === 'ongoing' ? 'Devam Ediyor' :
                               meeting.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'}
                            </Badge>
                          </div>
                          
                          {meeting.description && (
                            <p className="text-gray-600 mb-3">{meeting.description}</p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {format(new Date(meeting.startTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                            </div>
                            
                            {meeting.endTime && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Bitiş: {format(new Date(meeting.endTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {meeting.participants.length} katılımcı
                              {meeting.invitedEmails && meeting.invitedEmails.length > 0 && (
                                <span className="ml-2 text-blue-600">
                                  +{meeting.invitedEmails.length} email
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500">
                            Toplantı ID: {meeting.meetingId}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/meetings/${meeting._id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Görüntüle
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                              <Video className="w-4 h-4 mr-1" />
                              Jitsi&apos;de Aç
                            </a>
                          </Button>
                          
                          {meeting.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(meeting._id, 'ongoing')}
                            >
                              Başlat
                            </Button>
                          )}
                          
                          {meeting.status === 'ongoing' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(meeting._id, 'completed')}
                            >
                              Bitir
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMeeting(meeting._id)}
                            disabled={deletingId === meeting._id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz toplantı yok</h3>
                  <p className="text-gray-600 mb-6">İlk toplantınızı oluşturmak için aşağıdaki butona tıklayın</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/meetings/create">
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Toplantınızı Oluşturun
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
