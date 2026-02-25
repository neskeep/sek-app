// ---------------------------------------------------------------------------
// Service Worker: Push Notification Handler
// Importado por Workbox via importScripts en el SW generado.
// ---------------------------------------------------------------------------

self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()

  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/pwa-192x192.png',
    badge: data.badge || '/icons/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: [
      { action: 'open', title: 'Ver calendario' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'SEK Calendario', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus()
        }
      }
      return clients.openWindow(urlToOpen)
    })
  )
})
