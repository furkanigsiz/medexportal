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
    // Cihaz izinleri için ayarlar
    requireDisplayName: false,
    enableLayerSizing: true,
    enableNoisyMicDetection: true,
    enableTalkWhileMuted: true,
    enableRemb: true,
    enableTcc: true,
    useStunTurn: true,
    // Mikrofon ve kamera izinleri
    constraints: {
      video: {
        aspectRatio: 16 / 9,
        height: {
          ideal: 720,
          max: 720,
          min: 240
        }
      }
    },
    // Cihaz seçimi için
    enableDeviceSelection: true,
    // Otomatik cihaz seçimi
    enableAutomaticDeviceSelection: true,
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
    // Cihaz seçimi arayüzü
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_FOOTER: false,
    DISPLAY_WELCOME_PAGE_ADDITIONAL_CARD: false,
    // Cihaz izinleri için
    AUDIO_LEVEL_PRIMARY_COLOR: 'rgba(255,255,255,0.4)',
    AUDIO_LEVEL_SECONDARY_COLOR: 'rgba(255,255,255,0.2)',
  }
}
