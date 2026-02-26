import webpush from 'web-push'
import { getTodayInfo, buildNotificationMessage } from '~~/server/utils/calendar'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Verificar autorizacion
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || authHeader !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
    throw createError({ statusCode: 400, statusMessage: 'Provide a valid PushSubscription object' })
  }

  // Configurar VAPID
  webpush.setVapidDetails(
    'mailto:notificaciones@sekcalendar.app',
    config.public.vapidPublicKey,
    config.vapidPrivateKey,
  )

  // Generar mensaje
  const { dateKey, info } = getTodayInfo()
  const { title, body: notifBody } = buildNotificationMessage(dateKey, info)

  const payload = JSON.stringify({
    title,
    body: notifBody,
    icon: '/icons/pwa-192x192.png',
    badge: '/icons/pwa-192x192.png',
    data: { url: '/' },
  })

  // Enviar a la suscripcion proporcionada
  await webpush.sendNotification(body, payload)

  return { ok: true, date: dateKey, title, body: notifBody }
})
