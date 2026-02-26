// Diagnostic endpoint — returns push system status.
// Requires authorization (same as send endpoint).
// Usage: GET /api/push/debug (with Authorization: Bearer <CRON_SECRET>)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const redis = getRedis()

  // Check subscriptions
  const endpoints = await redis.smembers('push:endpoints')
  const subscriptionCount = endpoints?.length ?? 0

  // Check dedup keys
  const { dateKey, info } = getTodayInfo()
  const morningDedup = await redis.get(`push:last-sent:morning:${dateKey}`)
  const eveningDedup = await redis.get(`push:last-sent:evening:${dateKey}`)

  // Check old dedup key format (before Phase 5)
  const oldDedup = await redis.get(`push:last-sent:${dateKey}`)

  // Check config
  const hasVapidPublic = !!config.public.vapidPublicKey
  const hasVapidPrivate = !!config.vapidPrivateKey
  const hasCronSecret = !!config.cronSecret

  return {
    ok: true,
    date: dateKey,
    todayInfo: info ? { cycleDay: info.cycleDay, special: info.special, label: info.label } : null,
    subscriptions: {
      count: subscriptionCount,
      endpoints: endpoints?.map(e => e.substring(0, 50) + '...') ?? [],
    },
    deduplication: {
      morningDedup: morningDedup ?? null,
      eveningDedup: eveningDedup ?? null,
      oldFormatDedup: oldDedup ?? null,
    },
    config: {
      hasVapidPublic,
      hasVapidPrivate,
      hasCronSecret,
    },
  }
})
