# 🎯 Jitsi Meet Toplantı Sistemi Entegrasyonu

## 📋 Genel Bakış

Medex Portal'a Jitsi Meet kullanarak görüntülü toplantı sistemi eklenmesi planı. Bu sistem şirket içi toplantıları kolaylaştıracak ve uzaktan çalışma imkanlarını artıracak.

## 🎯 Özellikler

### Temel Özellikler:
- ✅ **Anlık Toplantı Başlatma** - Hemen toplantı oluşturma
- ✅ **Toplantı Planlama** - Gelecek toplantılar için rezervasyon
- ✅ **Davet Sistemi** - Email/SMS ile katılımcı davetleri
- ✅ **Toplantı Geçmişi** - Tamamlanan toplantıların kayıtları
- ✅ **Ekran Paylaşımı** - Jitsi'nin built-in ekran paylaşımı
- ✅ **Toplantı Kayıtları** - Jitsi'nin kayıt özelliği
- ✅ **Chat Sistemi** - Toplantı içi mesajlaşma
- ✅ **Katılımcı Yönetimi** - Mikrofon/kamera kontrolü

### Gelişmiş Özellikler:
- 🔄 **Toplantı Bildirimleri** - Email/SMS hatırlatmaları
- 🔄 **Toplantı Şablonları** - Tekrarlayan toplantılar
- 🔄 **Raporlama** - Toplantı istatistikleri
- 🔄 **Entegrasyon** - Google Calendar, Outlook

## 🛠️ Teknik Gereksinimler

### 1. **Gerekli Paketler:**
```bash
npm install @jitsi/react-sdk
npm install uuid
npm install @types/uuid
npm install date-fns
```

### 2. **Jitsi Meet Konfigürasyonu:**
```typescript
// lib/jitsi-config.ts
export const JITSI_CONFIG = {
  domain: 'meet.jit.si', // Ücretsiz Jitsi sunucusu
  // domain: 'your-domain.com', // Kendi sunucunuz (opsiyonel)
  
  configOverwrite: {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    enableClosePage: false,
    disableModeratorIndicator: false,
    startScreenSharing: false,
    enableEmailInStats: false,
  },
  
  interfaceConfigOverwrite: {
    TOOLBAR_BUTTONS: [
      'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
      'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
      'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
      'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
      'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
    ],
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_POWERED_BY: false,
  }
}
```

## 📊 Veritabanı Şeması

### Convex Schema Güncellemesi:
```typescript
// convex/schema.ts'ye eklenecek
meetings: defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  startTime: v.number(),
  endTime: v.optional(v.number()),
  organizerId: v.id("users"),
  participants: v.array(v.id("users")),
  invitedEmails: v.optional(v.array(v.string())), // Email davetleri
  status: v.union(
    v.literal("scheduled"), 
    v.literal("ongoing"), 
    v.literal("completed"), 
    v.literal("cancelled")
  ),
  meetingId: v.string(), // Jitsi room ID (unique)
  meetingUrl: v.string(),
  recordingUrl: v.optional(v.string()),
  isRecurring: v.optional(v.boolean()),
  recurrencePattern: v.optional(v.string()), // daily, weekly, monthly
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_organizer", ["organizerId"])
.index("by_status", ["status"])
.index("by_start_time", ["startTime"])
```

## 🔧 Convex Fonksiyonları

### 1. **Toplantı CRUD İşlemleri:**
```typescript
// convex/meetings.ts

// Toplantı oluşturma
export const createMeeting = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    participants: v.array(v.id("users")),
    invitedEmails: v.optional(v.array(v.string())),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Mock user for demo
    const organizer = { _id: "mock-user-id" as any, name: "Demo Admin" };
    
    const meetingId = `medex-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingUrl = `https://meet.jit.si/${meetingId}`;
    
    const meeting = await ctx.db.insert("meetings", {
      title: args.title,
      description: args.description,
      startTime: args.startTime,
      endTime: args.endTime,
      organizerId: organizer._id,
      participants: args.participants,
      invitedEmails: args.invitedEmails,
      status: "scheduled",
      meetingId,
      meetingUrl,
      isRecurring: args.isRecurring || false,
      recurrencePattern: args.recurrencePattern,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return meeting;
  },
});

// Toplantıları getirme
export const getMeetings = query({
  args: {
    status: v.optional(v.union(
      v.literal("scheduled"), 
      v.literal("ongoing"), 
      v.literal("completed"), 
      v.literal("cancelled")
    )),
  },
  handler: async (ctx, args) => {
    // Geçici olarak tüm toplantıları döndür
    return await ctx.db.query("meetings").collect();
  },
});

// Toplantıya katılma
export const joinMeeting = mutation({
  args: {
    meetingId: v.id("meetings"),
  },
  handler: async (ctx, args) => {
    const meeting = await ctx.db.get(args.meetingId);
    if (!meeting) {
      throw new Error("Toplantı bulunamadı");
    }
    
    // Toplantı durumunu ongoing olarak güncelle
    await ctx.db.patch(args.meetingId, {
      status: "ongoing",
      updatedAt: Date.now(),
    });
    
    return meeting;
  },
});

// Toplantı durumunu güncelleme
export const updateMeetingStatus = mutation({
  args: {
    meetingId: v.id("meetings"),
    status: v.union(
      v.literal("scheduled"), 
      v.literal("ongoing"), 
      v.literal("completed"), 
      v.literal("cancelled")
    ),
    recordingUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.meetingId, {
      status: args.status,
      recordingUrl: args.recordingUrl,
      updatedAt: Date.now(),
    });
  },
});
```

## 🎨 React Bileşenleri

### 1. **Toplantı Listesi Sayfası:**
```typescript
// app/meetings/page.tsx
'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Video, Clock } from 'lucide-react'
import Link from 'next/link'

export default function MeetingsPage() {
  const meetings = useQuery(api.meetings.getMeetings)
  const joinMeeting = useMutation(api.meetings.joinMeeting)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Toplantılar</h1>
        <Button asChild>
          <Link href="/meetings/create">
            <Video className="w-4 h-4 mr-2" />
            Yeni Toplantı
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {meetings?.map((meeting) => (
          <Card key={meeting._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{meeting.title}</CardTitle>
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
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(meeting.startTime).toLocaleString('tr-TR')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {meeting.participants.length} katılımcı
                </div>
                {meeting.description && (
                  <p className="text-sm text-gray-600">{meeting.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button asChild>
                    <Link href={`/meetings/${meeting._id}`}>
                      <Video className="w-4 h-4 mr-2" />
                      Katıl
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={meeting.meetingUrl} target="_blank">
                      Jitsi'de Aç
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### 2. **Toplantı Oluşturma Sayfası:**
```typescript
// app/meetings/create/page.tsx
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

export default function CreateMeetingPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [invitedEmails, setInvitedEmails] = useState('')
  
  const createMeeting = useMutation(api.meetings.createMeeting)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emails = invitedEmails.split(',').map(email => email.trim()).filter(Boolean)
    
    await createMeeting({
      title,
      description: description || undefined,
      startTime: new Date(startTime).getTime(),
      endTime: endTime ? new Date(endTime).getTime() : undefined,
      participants: [], // Şimdilik boş, sonra kullanıcı seçimi eklenebilir
      invitedEmails: emails.length > 0 ? emails : undefined,
    })
    
    router.push('/meetings')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Toplantı Oluştur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Toplantı Başlığı</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Başlangıç Zamanı</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endTime">Bitiş Zamanı</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="invitedEmails">Davet Edilecek Emailler (virgülle ayırın)</Label>
              <Input
                id="invitedEmails"
                value={invitedEmails}
                onChange={(e) => setInvitedEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">Toplantı Oluştur</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                İptal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. **Jitsi Video Chat Bileşeni:**
```typescript
// components/JitsiMeeting.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { JitsiMeetExternalAPI } from '@jitsi/react-sdk'

interface JitsiMeetingProps {
  meetingId: string
  userName: string
  onMeetingEnd?: () => void
}

export default function JitsiMeeting({ meetingId, userName, onMeetingEnd }: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<JitsiMeetExternalAPI | null>(null)

  useEffect(() => {
    if (!jitsiContainerRef.current) return

    const domain = 'meet.jit.si'
    const options = {
      roomName: meetingId,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: userName,
      },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
        enableClosePage: false,
        disableModeratorIndicator: false,
        startScreenSharing: false,
        enableEmailInStats: false,
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
          'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
          'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
          'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_POWERED_BY: false,
      }
    }

    const api = new JitsiMeetExternalAPI(domain, options)
    setJitsiApi(api)

    api.addEventListeners({
      readyToClose: () => {
        console.log('Toplantı kapatılıyor')
        onMeetingEnd?.()
      },
      participantLeft: (participant: any) => {
        console.log('Katılımcı ayrıldı:', participant)
      },
      participantJoined: (participant: any) => {
        console.log('Yeni katılımcı:', participant)
      },
      videoConferenceJoined: () => {
        console.log('Toplantıya katıldınız')
      },
      videoConferenceLeft: () => {
        console.log('Toplantıdan ayrıldınız')
        onMeetingEnd?.()
      }
    })

    return () => {
      api?.dispose()
    }
  }, [meetingId, userName, onMeetingEnd])

  return (
    <div className="w-full h-screen">
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  )
}
```

### 4. **Toplantı Odası Sayfası:**
```typescript
// app/meetings/[id]/page.tsx
'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'
import JitsiMeeting from '@/components/JitsiMeeting'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface MeetingRoomPageProps {
  params: {
    id: string
  }
}

export default function MeetingRoomPage({ params }: MeetingRoomPageProps) {
  const meeting = useQuery(api.meetings.getMeetings)
  const joinMeeting = useMutation(api.meetings.joinMeeting)
  const updateMeetingStatus = useMutation(api.meetings.updateMeetingStatus)
  const router = useRouter()

  const currentMeeting = meeting?.find(m => m._id === params.id)

  const handleJoinMeeting = async () => {
    if (currentMeeting) {
      await joinMeeting({ meetingId: currentMeeting._id as Id<"meetings"> })
    }
  }

  const handleMeetingEnd = async () => {
    if (currentMeeting) {
      await updateMeetingStatus({
        meetingId: currentMeeting._id as Id<"meetings">,
        status: "completed"
      })
      router.push('/meetings')
    }
  }

  if (!currentMeeting) {
    return <div>Toplantı bulunamadı</div>
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{currentMeeting.title}</h1>
            <p className="text-sm text-gray-600">
              {new Date(currentMeeting.startTime).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
        <Button onClick={handleJoinMeeting}>
          Toplantıya Katıl
        </Button>
      </div>
      
      <div className="flex-1">
        <JitsiMeeting
          meetingId={currentMeeting.meetingId}
          userName="Demo User"
          onMeetingEnd={handleMeetingEnd}
        />
      </div>
    </div>
  )
}
```

## 🚀 Implementasyon Sırası

### 1. **İlk Adım - Schema Güncelleme:**
```bash
# Convex schema'yı güncelle
# convex/schema.ts'ye meetings tablosunu ekle
```

### 2. **İkinci Adım - Convex Fonksiyonları:**
```bash
# convex/meetings.ts dosyasını oluştur
# CRUD fonksiyonlarını ekle
```

### 3. **Üçüncü Adım - React Bileşenleri:**
```bash
# Toplantı listesi sayfası
# Toplantı oluşturma sayfası
# Jitsi video chat bileşeni
# Toplantı odası sayfası
```

### 4. **Dördüncü Adım - Navigation Güncelleme:**
```bash
# Navbar'a "Toplantılar" linki ekle
# Admin panelinde toplantı yönetimi
```

## 📱 Responsive Tasarım

- **Desktop**: Tam ekran video chat
- **Tablet**: Optimized layout
- **Mobile**: Touch-friendly controls

## 🔒 Güvenlik

- **Room ID**: Unique ve güvenli
- **Katılımcı Kontrolü**: Sadece davet edilenler
- **Toplantı Şifreleri**: Opsiyonel şifre koruması

## 📊 Analytics (Gelecek)

- Toplantı süreleri
- Katılımcı sayıları
- En aktif kullanıcılar
- Toplantı başarı oranları

## 🎯 Sonraki Adımlar

1. **Schema güncelleme** ✅
2. **Convex fonksiyonları** ✅
3. **React bileşenleri** ✅
4. **Navigation güncelleme**
5. **Test ve optimizasyon**
6. **Bildirim sistemi**
7. **Raporlama özellikleri**

---

**Not**: Bu implementasyon Jitsi Meet'in ücretsiz sunucusunu kullanır. Daha fazla kontrol için kendi Jitsi sunucunuzu kurabilirsiniz.
