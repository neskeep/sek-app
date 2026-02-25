<script setup lang="ts">
const {
  isIOS,
  isAndroid,
  isStandalone,
  canInstallNative,
  showBanner,
  platform,
  installNative,
  dismissBanner,
} = useInstallPrompt()

const isDesktop = computed(() => platform.value === 'desktop')
const showDesktopBanner = computed(() => isDesktop.value && canInstallNative.value)
const showAndroidNative = computed(() => isAndroid.value && canInstallNative.value)
const showAndroidManual = computed(() => isAndroid.value && !canInstallNative.value)

const visible = computed(() => {
  if (!showBanner.value || isStandalone.value) return false
  if (isIOS.value) return true
  if (isAndroid.value) return true
  if (showDesktopBanner.value) return true
  return false
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-x-0 bottom-0 z-50 animate-slide-up"
      role="dialog"
      aria-label="Instalar aplicacion"
    >
      <!-- Backdrop subtle -->
      <div class="absolute inset-0 -top-20 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <!-- Banner card -->
      <div
        class="relative mx-auto max-w-md bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-6 pt-5 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <!-- Close button -->
        <button
          class="btn-icon absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Cerrar banner de instalacion"
          @click="dismissBanner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <!-- Header -->
        <div class="flex items-center gap-3 mb-2 pr-10">
          <!-- App icon -->
          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-primary leading-tight">
            Instala SEK Calendario
          </h2>
        </div>

        <p class="text-sm text-gray-500 mb-5 leading-relaxed">
          Accede rapido al dia del ciclo desde tu pantalla de inicio
        </p>

        <!-- iOS Instructions -->
        <div v-if="isIOS" class="space-y-4">
          <div class="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
            <!-- Step 1: Share -->
            <div class="flex flex-col items-center gap-1.5 shrink-0">
              <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <!-- Safari Share icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2874fc" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-12V12" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
              <span class="text-[11px] font-semibold text-gray-500 text-center leading-tight">
                Compartir
              </span>
            </div>

            <!-- Arrow -->
            <div class="flex items-center self-center text-gray-300 shrink-0 pt-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>

            <!-- Step 2: Add to Home Screen -->
            <div class="flex flex-col items-center gap-1.5 shrink-0">
              <div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <!-- Add to home screen icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2874fc" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <span class="text-[11px] font-semibold text-gray-500 text-center leading-tight">
                Agregar<br>a inicio
              </span>
            </div>
          </div>

          <p class="text-xs text-gray-400 text-center">
            Toca el boton <strong class="text-gray-500">Compartir</strong> y luego <strong class="text-gray-500">"Agregar a inicio"</strong>
          </p>

          <button
            class="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98]"
            @click="dismissBanner"
          >
            Entendido
          </button>
        </div>

        <!-- Android with native prompt -->
        <div v-else-if="showAndroidNative" class="space-y-3">
          <p class="text-sm text-gray-500">
            Instala la app para acceso rapido
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98]"
              @click="installNative"
            >
              Instalar
            </button>
            <button
              class="flex-1 py-3 px-6 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors active:scale-[0.98]"
              @click="dismissBanner"
            >
              Ahora no
            </button>
          </div>
        </div>

        <!-- Android without native prompt -->
        <div v-else-if="showAndroidManual" class="space-y-4">
          <div class="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <!-- Three dots menu icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#2874fc" aria-hidden="true">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              Abre el menu <strong class="text-gray-800">(&#8942;)</strong> y selecciona <strong class="text-gray-800">"Instalar aplicacion"</strong>
            </p>
          </div>

          <button
            class="w-full py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98]"
            @click="dismissBanner"
          >
            Entendido
          </button>
        </div>

        <!-- Desktop with native prompt -->
        <div v-else-if="showDesktopBanner" class="space-y-3">
          <p class="text-sm text-gray-500">
            Instala la app en tu escritorio
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors active:scale-[0.98]"
              @click="installNative"
            >
              Instalar
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
    </div>
  </Teleport>
</template>
