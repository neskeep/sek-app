// ---------------------------------------------------------------------------
// Composable: useShare
// Web Share API with clipboard fallback.
// ---------------------------------------------------------------------------

export function useShare() {
  const canNativeShare = computed(() => {
    if (!import.meta.client) return false
    return 'share' in navigator
  })

  const copied = ref(false)

  async function share(text: string, url?: string): Promise<boolean> {
    const shareUrl = url ?? (import.meta.client ? window.location.origin : '')

    if (canNativeShare.value) {
      try {
        await navigator.share({
          title: 'SEK Calendario',
          text,
          url: shareUrl,
        })
        return true
      } catch {
        // User cancelled or error — not a failure
        return false
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
      return true
    } catch {
      return false
    }
  }

  return { canNativeShare, copied, share }
}
