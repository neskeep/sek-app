import webpush from 'web-push'

interface StoredSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // ----- Authorization check -----
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: invalid or missing authorization header.',
    })
  }

  // ----- Configure web-push VAPID -----
  webpush.setVapidDetails(
    'mailto:notificaciones@sekcalendar.app',
    config.public.vapidPublicKey,
    config.vapidPrivateKey,
  )

  // ----- Build notification content -----
  const { dateKey, info } = getTodayInfo()
  const { title, body } = buildNotificationMessage(dateKey, info)

  // ----- Deduplication: prevent double notifications on the same day -----
  const redis = getRedis()
  const dedupKey = `push:last-sent:${dateKey}`
  const alreadySent = await redis.get(dedupKey)
  if (alreadySent) {
    return { ok: true, sent: 0, failed: 0, date: dateKey, skipped: true }
  }
  // Mark as sent with 24h expiry
  await redis.set(dedupKey, new Date().toISOString(), { ex: 86400 })

  const payload = JSON.stringify({
    title,
    body,
    icon: '/icons/pwa-192x192.png',
    badge: '/icons/pwa-192x192.png',
    data: { url: '/' },
  })

  // ----- Retrieve all subscriptions from Redis -----
  const endpoints = await redis.smembers('push:endpoints')

  if (!endpoints || endpoints.length === 0) {
    return { ok: true, sent: 0, failed: 0, date: dateKey }
  }

  let sent = 0
  let failed = 0

  // ----- Send notification to each subscription -----
  const sendPromises = endpoints.map(async (endpoint) => {
    try {
      const subJson = await redis.get<string>(`push:sub:${endpoint}`)
      if (!subJson) {
        // Stale endpoint in set with no subscription data — clean up
        await redis.srem('push:endpoints', endpoint)
        failed++
        return
      }

      const subscription: StoredSubscription = typeof subJson === 'string'
        ? JSON.parse(subJson)
        : subJson

      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        },
        payload,
      )
      sent++
    }
    catch (error: unknown) {
      failed++
      // Clean up dead subscriptions (gone or not found)
      const statusCode = (error as { statusCode?: number })?.statusCode
      if (statusCode === 404 || statusCode === 410) {
        await Promise.all([
          redis.srem('push:endpoints', endpoint),
          redis.del(`push:sub:${endpoint}`),
        ])
      }
    }
  })

  await Promise.all(sendPromises)

  return { ok: true, sent, failed, date: dateKey }
})
