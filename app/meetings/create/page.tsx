'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Mail, Clock } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function CreateMeetingPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [invitedEmails, setInvitedEmails] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrencePattern, setRecurrencePattern] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const createMeeting = useMutation(api.meetings.createMeeting)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const emails = invitedEmails.split(',').map(email => email.trim()).filter(Boolean)
      
      await createMeeting({
        title,
        description: description || undefined,
        startTime: new Date(startTime).getTime(),
        endTime: endTime ? new Date(endTime).getTime() : undefined,
        participants: [], // Şimdilik boş, sonra kullanıcı seçimi eklenebilir
        invitedEmails: emails.length > 0 ? emails : undefined,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : undefined,
      })
      
      router.push('/meetings')
    } catch (error) {
      console.error('Toplantı oluşturulurken hata:', error)
      alert('Toplantı oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Link href="/meetings" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Toplantılar&apos;a Dön
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Yeni Toplantı Oluştur</h1>
        <p className="text-gray-600 mt-2">Şirket içi toplantınızı planlayın ve katılımcıları davet edin</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Toplantı Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Toplantı Başlığı *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Haftalık Ekip Toplantısı"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Açıklama
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Toplantı hakkında detaylar..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  Başlangıç Zamanı *
                </Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  Bitiş Zamanı
                </Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="invitedEmails" className="text-sm font-medium text-gray-700">
                Davet Edilecek Emailler
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="invitedEmails"
                  value={invitedEmails}
                  onChange={(e) => setInvitedEmails(e.target.value)}
                  placeholder="email1@example.com, email2@example.com"
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email adreslerini virgülle ayırın
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                  Tekrarlayan Toplantı
                </Label>
              </div>
              
              {isRecurring && (
                <div>
                  <Label htmlFor="recurrencePattern" className="text-sm font-medium text-gray-700">
                    Tekrarlama Sıklığı
                  </Label>
                  <select
                    id="recurrencePattern"
                    value={recurrencePattern}
                    onChange={(e) => setRecurrencePattern(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz</option>
                    <option value="daily">Günlük</option>
                    <option value="weekly">Haftalık</option>
                    <option value="monthly">Aylık</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Toplantı Oluştur
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={isLoading}
              >
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </>
  )
}
