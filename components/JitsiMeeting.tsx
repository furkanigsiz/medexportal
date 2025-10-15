'use client'

import { useEffect, useRef, useState } from 'react'
import { JITSI_CONFIG } from '@/lib/jitsi-config'

// Jitsi Meet External API'yi dinamik olarak yükle
interface JitsiMeetExternalAPI {
  new (domain: string, options: Record<string, unknown>): {
    addEventListeners: (listeners: Record<string, (data?: unknown) => void>) => void;
    dispose: () => void;
  };
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: JitsiMeetExternalAPI;
  }
}

interface JitsiMeetingProps {
  meetingId: string
  userName: string
  onMeetingEnd?: () => void
}

export default function JitsiMeeting({ meetingId, userName, onMeetingEnd }: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<{
    addEventListeners: (listeners: Record<string, (data?: unknown) => void>) => void;
    dispose: () => void;
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jitsiContainerRef.current) return

    let isMounted = true;

    // Jitsi Meet script'ini dinamik olarak yükle
    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
          return;
        }

        // Script zaten yüklenmiş mi kontrol et
        const existingScript = document.querySelector('script[src*="external_api.js"]');
        if (existingScript) {
          // Script yükleniyor, biraz bekle
          const checkAPI = () => {
            if (window.JitsiMeetExternalAPI) {
              resolve(window.JitsiMeetExternalAPI);
            } else {
              setTimeout(checkAPI, 100);
            }
          };
          checkAPI();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => {
          if (window.JitsiMeetExternalAPI) {
            resolve(window.JitsiMeetExternalAPI);
          } else {
            reject(new Error('JitsiMeetExternalAPI yüklenemedi'));
          }
        };
        script.onerror = () => reject(new Error('Jitsi script yüklenemedi'));
        document.head.appendChild(script);
      });
    };

    const initializeJitsi = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const JitsiMeetExternalAPI = await loadJitsiScript();
        
        if (!isMounted) return;
        
        const options = {
          roomName: meetingId,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: userName,
          },
          configOverwrite: {
            ...JITSI_CONFIG.configOverwrite,
            // Cihaz izinleri için ek ayarlar
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            enableClosePage: false,
            // Cihaz seçimi için
            enableDeviceSelection: true,
            enableAutomaticDeviceSelection: true,
            // Mikrofon ve kamera izinleri
            constraints: {
              video: {
                aspectRatio: 16 / 9,
                height: { ideal: 720, max: 720, min: 240 }
              }
            }
          },
          interfaceConfigOverwrite: JITSI_CONFIG.interfaceConfigOverwrite
        };

        const api = new (JitsiMeetExternalAPI as JitsiMeetExternalAPI)(JITSI_CONFIG.domain, options);
        
        if (!isMounted) {
          api.dispose();
          return;
        }
        
        setJitsiApi(api);

        api.addEventListeners({
          readyToClose: () => {
            console.log('Toplantı kapatılıyor')
            onMeetingEnd?.()
          },
          participantLeft: (participant: unknown) => {
            console.log('Katılımcı ayrıldı:', participant)
          },
          participantJoined: (participant: unknown) => {
            console.log('Yeni katılımcı:', participant)
          },
          videoConferenceJoined: () => {
            console.log('Toplantıya katıldınız')
            setIsLoading(false)
          },
          videoConferenceLeft: () => {
            console.log('Toplantıdan ayrıldınız')
            onMeetingEnd?.()
          }
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Jitsi başlatılırken hata:', error);
        setError('Jitsi Meet yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    };

    initializeJitsi();

    return () => {
      isMounted = false;
      if (jitsiApi) {
        jitsiApi.dispose();
      }
    };
  }, [meetingId, userName, onMeetingEnd, jitsiApi])

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Jitsi Meet Yüklenemedi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Jitsi Meet yükleniyor...</p>
          </div>
        </div>
      )}
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  )
}
