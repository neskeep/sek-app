// ---------------------------------------------------------------------------
// Composable: useAppBadge
// Sets the app icon badge to the current cycle day number.
// Also registers Periodic Background Sync for daily badge updates (Android).
// ---------------------------------------------------------------------------

export function useAppBadge() {
  const { todayCycleDay } = useCalendar()

  async function updateBadge() {
    if (!import.meta.client) return
    if (!('setAppBadge' in navigator)) return

    const cycleNumber = todayCycleDay.value
      ? parseInt(todayCycleDay.value.replace('D', ''), 10)
      : null

    try {
      if (cycleNumber) {
        await (navigator as any).setAppBadge(cycleNumber)
      } else {
        await (navigator as any).clearAppBadge()
      }
    } catch {
      // Not supported or permission denied
    }
  }

  async function registerPeriodicSync() {
    if (!import.meta.client) return
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.ready

      // Check if periodicSync is supported (Android Chrome only)
      if (!('periodicSync' in registration)) return

      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as any,
      })

      if (status.state === 'granted') {
        await (registration as any).periodicSync.register('update-badge', {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        })
      }
    } catch {
      // Not supported — no problem, badge updates on app open + push
    }
  }

  // Update badge whenever cycle day changes
  watch(todayCycleDay, () => updateBadge())

  onMounted(() => {
    updateBadge()
    registerPeriodicSync()
  })

  return { updateBadge }
}
