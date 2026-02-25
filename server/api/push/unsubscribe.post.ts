interface UnsubscribeBody {
  endpoint: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<UnsubscribeBody>(event)

  if (!body?.endpoint) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request: endpoint is required.',
    })
  }

  const redis = getRedis()
  const { endpoint } = body

  // Remove from Redis:
  // 1. Remove endpoint from the SET
  // 2. Delete the subscription data
  await Promise.all([
    redis.srem('push:endpoints', endpoint),
    redis.del(`push:sub:${endpoint}`),
  ])

  return { ok: true }
})
