// Temporary endpoint to clear all push subscriptions from Redis.
// DELETE THIS FILE after use.

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const redis = getRedis()

  const endpoints = await redis.smembers('push:endpoints')
  if (!endpoints || endpoints.length === 0) {
    return { ok: true, cleared: 0 }
  }

  // Delete each subscription and all dedup keys
  const delPromises = endpoints.flatMap(ep => [
    redis.srem('push:endpoints', ep),
    redis.del(`push:sub:${ep}`),
  ])

  // Also clear dedup keys
  const keys = await redis.keys('push:last-sent:*')
  if (keys?.length) {
    delPromises.push(...keys.map(k => redis.del(k)))
  }

  await Promise.all(delPromises)

  return { ok: true, cleared: endpoints.length, dedupCleared: keys?.length ?? 0 }
})
