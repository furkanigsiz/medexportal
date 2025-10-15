'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import JitsiMeeting from '@/components/JitsiMeeting'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Video, Users, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useState, use } from 'react'

interface MeetingRoomPageProps {
  params: Promise<{
    id: string
  }>
}

export default function MeetingRoomPage({ params }: MeetingRoomPageProps) {
  const resolvedParams = use(params)
  const [isJoining, setIsJoining] = useState(false)
  const meetings = useQuery(api.meetings.getMeetings)
  const currentUser = useQuery(api.users.getCurrentUser)
  const joinMeeting = useMutation(api.meetings.joinMeeting)
  const updateMeetingStatus = useMutation(api.meetings.updateMeetingStatus)
  const router = useRouter()

  const currentMeeting = meetings?.find(m => m._id === resolvedParams.id)

  const handleJoinMeeting = async () => {
    if (currentMeeting) {
      setIsJoining(true)
      try {
        await joinMeeting({ meetingId: currentMeeting._id as Id<"meetings"> })
      } catch (error) {
        console.error('Toplantıya katılırken hata:', error)
        alert('Toplantıya katılırken bir hata oluştu.')
      } finally {
        setIsJoining(false)
      }
    }
  }

  const handleMeetingEnd = async () => {
    if (currentMeeting) {
      try {
        await updateMeetingStatus({
          meetingId: currentMeeting._id as Id<"meetings">,
          status: "completed"
        })
        router.push('/meetings')
      } catch (error) {
        console.error('Toplantı durumu güncellenirken hata:', error)
      }
    }
  }

  if (!currentMeeting) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Toplantı bulunamadı</h2>
          <p className="text-gray-600 mb-4">Aradığınız toplantı mevcut değil veya silinmiş olabilir.</p>
          <Button onClick={() => router.push('/meetings')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Toplantılar&apos;a Dön
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Toplantı Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{currentMeeting.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(currentMeeting.startTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
              </div>
              {currentMeeting.endTime && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(currentMeeting.endTime), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                </div>
              )}
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {currentMeeting.participants.length} katılımcı
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleJoinMeeting}
            disabled={isJoining}
            className="bg-green-600 hover:bg-green-700"
          >
            <Video className="w-4 h-4 mr-2" />
            {isJoining ? 'Katılıyor...' : 'Toplantıya Katıl'}
          </Button>
        </div>
      </div>
      
      {/* Toplantı Açıklaması */}
      {currentMeeting.description && (
        <div className="bg-blue-50 border-b p-4">
          <p className="text-sm text-blue-800">{currentMeeting.description}</p>
        </div>
      )}
      
      {/* Jitsi Video Chat */}
      <div className="flex-1 bg-gray-100">
        <JitsiMeeting
          meetingId={currentMeeting.meetingId}
          userName="Demo User"
          onMeetingEnd={handleMeetingEnd}
        />
      </div>
      
      {/* Toplantı Bilgileri Footer */}
      <div className="bg-white border-t p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Toplantı ID: {currentMeeting.meetingId}</span>
            <span>Durum: {
              currentMeeting.status === 'scheduled' ? 'Planlandı' :
              currentMeeting.status === 'ongoing' ? 'Devam Ediyor' :
              currentMeeting.status === 'completed' ? 'Tamamlandı' : 'İptal Edildi'
            }</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <a href={currentMeeting.meetingUrl} target="_blank" rel="noopener noreferrer">
                Jitsi&apos;de Aç
              </a>
            </Button>
            {currentMeeting.recordingUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
              >
                <a href={currentMeeting.recordingUrl} target="_blank" rel="noopener noreferrer">
                  Kaydı İzle
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
