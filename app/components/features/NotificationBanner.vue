<script setup lang="ts">
const {
  isSupported,
  permission,
  isSubscribed,
  isLoading,
  canRequestPermission,
  subscribe,
} = useNotifications()

const { isIOS, isStandalone } = useInstallPrompt()

const DISMISS_KEY = 'sek-notif-banner-dismissed'
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 dias
const dismissed = ref(true) // Start hidden until onMounted
const showAfterDelay = ref(false)

onMounted(() => {
  const dismissedAt = localStorage.getItem(DISMISS_KEY)
  if (dismissedAt) {
    const elapsed = Date.now() - Number(dismissedAt)
    dismissed.value = elapsed < DISMISS_DURATION_MS
    if (!dismissed.value) localStorage.removeItem(DISMISS_KEY)
  } else {
    dismissed.value = false
  }

  // Delay 2000ms — after InstallBanner (which uses 1000ms)
  setTimeout(() => {
    showAfterDelay.value = true
  }, 2000)
})

const visible = computed(() => {
  if (!showAfterDelay.value) return false
  if (!isSupported.value) return false
  if (isSubscribed.value) return false
  if (permission.value === 'denied') return false
  if (dismissed.value) return false

  // On iOS, push notifications only work when installed as standalone PWA
  if (isIOS.value && !isStandalone.value) return false

  return true
})

const wasDenied = ref(false)

async function handleActivate() {
  const success = await subscribe()
  if (success) {
    dismissed.value = true
  }
  else if (permission.value === 'denied') {
    wasDenied.value = true
  }
}

function dismissBanner() {
  dismissed.value = true
  if (import.meta.client) {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-50 animate-slide-up"
      role="dialog"
      aria-label="Activar notificaciones"
    >
      <!-- Gradient shadow backdrop -->
      <div class="absolute inset-0 -top-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <!-- Banner card -->
      <div
        class="relative mx-auto max-w-md bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-6 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <!-- Close button -->
        <button
          class="btn-icon absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar banner de notificaciones"
          @click="dismissBanner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 mb-2 pr-10">
          <!-- Bell icon -->
          <div class="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-primary leading-tight">
            Notificaciones diarias
          </h2>
        </div>

        <p class="text-sm text-gray-500 mb-5 leading-relaxed">
          Recibe cada manana el dia del ciclo rotativo
        </p>

        <!-- Denied state -->
        <div v-if="wasDenied" class="space-y-3">
          <div class="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
            <div class="w-10 h-10 rounded-xl bg-receso/10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              Las notificaciones fueron bloqueadas. Activalas desde la <strong class="text-gray-800">configuracion del navegador</strong>.
            </p>
          </div>

          <button
            class="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98]"
            @click="dismissBanner"
          >
            Entendido
          </button>
        </div>

        <!-- Action buttons -->
        <div v-else class="flex gap-3">
          <button
            class="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading || !canRequestPermission"
            @click="handleActivate"
          >
            <span v-if="isLoading" class="inline-flex items-center gap-2">
              <svg class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Activando...
            </span>
            <span v-else>Activar</span>
          </button>
          <button
            class="flex-1 py-3 px-6 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
            @click="dismissBanner"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
