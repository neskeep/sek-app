import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  runtimeConfig: {
    vapidPrivateKey: '',
    cronSecret: '',
    public: {
      vapidPublicKey: 'BFQQ7-eAN_y3hLyZReTilAn4dqt8emDhLRAAGaaTJCcI33QSTLzOLyzltUbbyZa4UGhKs6pf2NCwzRQJhqnkcfM',
    },
  },

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#263060' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-180x180.png' },
      ],
    },
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'SEK Colombia - Calendario Escolar',
      short_name: 'SEK Calendario',
      description: 'Calendario escolar del Colegio SEK Colombia con sistema rotativo de 6 dias',
      theme_color: '#263060',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'icons/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'icons/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: undefined,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      importScripts: ['/sw-push.js'],
    },
    client: {
      installPrompt: true,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
