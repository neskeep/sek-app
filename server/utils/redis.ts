import { Redis } from '@upstash/redis'

let redis: Redis | null = null

/**
 * Returns a singleton Redis instance configured from environment variables.
 * Uses KV_REST_API_URL and KV_REST_API_TOKEN (Vercel KV convention).
 */
export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL || '',
      token: process.env.KV_REST_API_TOKEN || '',
    })
  }
  return redis
}
