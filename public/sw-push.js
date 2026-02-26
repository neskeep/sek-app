// ---------------------------------------------------------------------------
// Service Worker: Push Notifications + Badge API + Periodic Sync
// Importado por Workbox via importScripts en el SW generado.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Badge helper — extracts cycle day number from notification title
// ---------------------------------------------------------------------------
function extractCycleDayNumber(title) {
  // Matches "Dia 3 del ciclo" or "Manana: Dia 3" or "Proximo dia: D3"
  const match = title.match(/Dia\s*(\d)/i)
  return match ? parseInt(match[1], 10) : null
}

async function updateBadge(number) {
  if ('setAppBadge' in navigator) {
    try {
      if (number) {
        await navigator.setAppBadge(number)
      } else {
        await navigator.clearAppBadge()
      }
    } catch {
      // Badge API not supported or permission denied — ignore
    }
  }
}

// ---------------------------------------------------------------------------
// Push notification handler
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
    Promise.all([
      self.registration.showNotification(data.title || 'SEK Calendario', options),
      // Update app badge with cycle day number from notification
      updateBadge(extractCycleDayNumber(data.title || '')),
    ])
  )
})

// ---------------------------------------------------------------------------
// Notification click handler
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Periodic Background Sync (Android Chrome only)
// Updates the app badge with today's cycle day number daily.
// ---------------------------------------------------------------------------
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-badge') {
    event.waitUntil(updateBadgeFromCalendar())
  }
})

async function updateBadgeFromCalendar() {
  try {
    // Calculate today's date in Colombia timezone (UTC-5)
    const now = new Date()
    const colombiaMs = now.getTime() + (now.getTimezoneOffset() - 300) * 60000
    const colombiaDate = new Date(colombiaMs)
    const y = colombiaDate.getFullYear()
    const m = String(colombiaDate.getMonth() + 1).padStart(2, '0')
    const d = String(colombiaDate.getDate()).padStart(2, '0')
    const dateKey = `${y}-${m}-${d}`

    const response = await fetch('/api/today')
    if (response.ok) {
      const data = await response.json()
      if (data.cycleDay) {
        const num = parseInt(data.cycleDay.replace('D', ''), 10)
        await updateBadge(num)
        return
      }
    }
    // No cycle day today (weekend, holiday) — clear badge
    await updateBadge(null)
  } catch {
    // Offline or error — keep current badge
  }
}
