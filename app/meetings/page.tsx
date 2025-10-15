'use client'

import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Video, Clock, Plus } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import Navbar from '@/components/Navbar'

export default function MeetingsPage() {
  const meetings = useQuery(api.meetings.getMeetings, {})

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Toplantılar</h1>
          <p className="text-gray-600 mt-2">Şirket içi toplantılarınızı yönetin ve katılın</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href="/meetings/create">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Toplantı
          </Link>
        </Button>
      </div>

      {meetings && meetings.length > 0 ? (
        <div className="grid gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{meeting.title}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {format(new Date(meeting.startTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                  </div>
                  
                  {meeting.endTime && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Bitiş: {format(new Date(meeting.endTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {meeting.participants.length} katılımcı
                    {meeting.invitedEmails && meeting.invitedEmails.length > 0 && (
                      <span className="ml-2 text-blue-600">
                        +{meeting.invitedEmails.length} email davet
                      </span>
                    )}
                  </div>
                  
                  {meeting.description && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {meeting.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                      <Link href={`/meetings/${meeting._id}`}>
                        <Video className="w-4 h-4 mr-2" />
                        Katıl
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                        Jitsi&apos;de Aç
                      </Link>
                    </Button>
                    {meeting.recordingUrl && (
                      <Button variant="outline" asChild>
                        <Link href={meeting.recordingUrl} target="_blank" rel="noopener noreferrer">
                          Kaydı İzle
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
      </div>
    </>
  )
}
