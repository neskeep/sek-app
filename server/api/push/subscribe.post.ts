interface PushSubscriptionBody {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<PushSubscriptionBody>(event)

  // Validate required fields
  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    throw createError({
      statusCode: 400,
      message: 'Invalid subscription: endpoint, keys.p256dh, and keys.auth are required.',
    })
  }

  const redis = getRedis()
  const { endpoint } = body

  // Store the subscription in Redis:
  // 1. Add endpoint to the SET of all endpoints
  // 2. Store full subscription JSON keyed by endpoint
  await Promise.all([
    redis.sadd('push:endpoints', endpoint),
    redis.set(`push:sub:${endpoint}`, JSON.stringify(body)),
  ])

  return { ok: true }
})
