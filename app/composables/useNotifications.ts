// ---------------------------------------------------------------------------
// Composable: useNotifications
// Gestiona suscripciones push y permisos de notificaciones.
// ---------------------------------------------------------------------------

const NOTIFICATION_ENABLED_KEY = 'sek-notifications-enabled'

export function useNotifications() {
  const config = useRuntimeConfig()

  const isSupported = ref(false)
  const permission = ref<NotificationPermission>('default')
  const isSubscribed = ref(false)
  const isLoading = ref(false)

  onMounted(() => {
    isSupported.value = 'Notification' in window
      && 'serviceWorker' in navigator
      && 'PushManager' in window

    if (isSupported.value) {
      permission.value = Notification.permission
      checkExistingSubscription()
    }
  })

  async function checkExistingSubscription() {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    isSubscribed.value = !!subscription
  }

  // ---------------------------------------------------------------------------
  // Helper: convierte VAPID key de base64url a Uint8Array
  // ---------------------------------------------------------------------------
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // ---------------------------------------------------------------------------
  // Suscribirse a notificaciones push
  // ---------------------------------------------------------------------------
  async function subscribe(): Promise<boolean> {
    if (!isSupported.value) return false
    if (!config.public.vapidPublicKey) {
      console.error('VAPID public key is not configured')
      return false
    }
    isLoading.value = true
    try {
      const perm = await Notification.requestPermission()
      permission.value = perm
      if (perm !== 'granted') return false

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey) as BufferSource,
      })

      await $fetch('/api/push/subscribe', {
        method: 'POST',
        body: subscription.toJSON(),
      })

      isSubscribed.value = true
      localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true')
      return true
    }
    catch (error) {
      console.error('Failed to subscribe:', error)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Cancelar suscripcion push
  // ---------------------------------------------------------------------------
  async function unsubscribe(): Promise<boolean> {
    isLoading.value = true
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await $fetch('/api/push/unsubscribe', {
          method: 'POST',
          body: { endpoint: subscription.endpoint },
        })
        await subscription.unsubscribe()
      }
      isSubscribed.value = false
      localStorage.removeItem(NOTIFICATION_ENABLED_KEY)
      return true
    }
    catch (error) {
      console.error('Failed to unsubscribe:', error)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // ---------------------------------------------------------------------------
  // Computados
  // ---------------------------------------------------------------------------
  const canRequestPermission = computed(() =>
    isSupported.value && permission.value !== 'denied',
  )

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    canRequestPermission,
    subscribe,
    unsubscribe,
  }
}
