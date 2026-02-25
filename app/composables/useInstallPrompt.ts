// ---------------------------------------------------------------------------
// Composable: useInstallPrompt
// Maneja deteccion de plataforma y prompt de instalacion PWA.
// ---------------------------------------------------------------------------

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'sek-install-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias

export function useInstallPrompt() {
  // ---------------------------------------------------------------------------
  // Deteccion de plataforma
  // ---------------------------------------------------------------------------
  const isIOS = computed<boolean>(() => {
    if (!import.meta.client) return false
    const ua = navigator.userAgent
    return /iPhone|iPad|iPod/.test(ua) && !('MSStream' in window)
  })

  const isAndroid = computed<boolean>(() => {
    if (!import.meta.client) return false
    return /Android/.test(navigator.userAgent)
  })

  const isStandalone = computed<boolean>(() => {
    if (!import.meta.client) return false
    return window.matchMedia('(display-mode: standalone)').matches
      || (navigator as unknown as { standalone?: boolean }).standalone === true
  })

  const platform = computed<'ios' | 'android' | 'desktop'>(() => {
    if (isIOS.value) return 'ios'
    if (isAndroid.value) return 'android'
    return 'desktop'
  })

  // ---------------------------------------------------------------------------
  // beforeinstallprompt (Android Chrome / Desktop)
  // ---------------------------------------------------------------------------
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const canInstallNative = ref(false)

  // ---------------------------------------------------------------------------
  // Control de visibilidad del banner
  // ---------------------------------------------------------------------------
  const showBanner = ref(false)

  onMounted(() => {
    // Escuchar evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault()
      deferredPrompt.value = e as BeforeInstallPromptEvent
      canInstallNative.value = true
    })

    // Escuchar evento appinstalled
    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null
      canInstallNative.value = false
      showBanner.value = false
    })

    // No mostrar si ya esta instalada como standalone
    if (isStandalone.value) return

    // No mostrar si fue descartado recientemente
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10)
      if (Date.now() - dismissedAt < DISMISS_DURATION_MS) return
    }

    // Mostrar despues de un breve delay
    setTimeout(() => {
      showBanner.value = true
    }, 1000)
  })

  // ---------------------------------------------------------------------------
  // Metodos
  // ---------------------------------------------------------------------------
  async function installNative(): Promise<void> {
    if (!deferredPrompt.value) return
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      showBanner.value = false
    }
    deferredPrompt.value = null
    canInstallNative.value = false
  }

  function dismissBanner(): void {
    showBanner.value = false
    if (import.meta.client) {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    }
  }

  return {
    // Estado
    isIOS,
    isAndroid,
    isStandalone,
    canInstallNative,
    showBanner,
    platform,

    // Metodos
    installNative,
    dismissBanner,
  }
}
