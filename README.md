# SEK Colombia - Calendario Escolar

Progressive Web App del calendario escolar del **Colegio SEK Colombia** con sistema rotativo de 6 dias (D1-D6). Permite a padres y estudiantes consultar rapidamente el dia del ciclo actual, navegar el calendario mensual, y recibir notificaciones push automaticas.

**Produccion:** [sek-calendar.vercel.app](https://sek-calendar.vercel.app)

---

## Funcionalidades

### Calendario
- **Dia del ciclo en tiempo real** — Hero principal con el dia D1-D6 del ciclo rotativo actual
- **Vista semanal** — Franja horizontal lunes a viernes con dias del ciclo de la semana actual
- **Calendario mensual** — Grid navegable de agosto 2025 a junio 2026 con dias codificados por color
- **Detalle por dia** — Bottom sheet al tocar cualquier dia con informacion completa y opcion de compartir
- **Leyenda de colores** — Referencia visual de los tipos de dia (ciclo, festivo, receso, etc.)

### Dias especiales
El calendario identifica y diferencia visualmente:
- **Dias de ciclo** (D1-D6) — Dias regulares de clase con rotacion
- **Festivos** — Dias festivos colombianos (rojo)
- **Recesos** — Semanas de receso institucional (ambar)
- **Semana Santa** — Periodo de Semana Santa (morado)
- **Vacaciones** — Vacaciones de fin de ano (verde)
- **Clausura** — Ceremonia de clausura (acento)
- **Celebraciones** — Eventos especiales como navidad (dorado)

### PWA (Progressive Web App)
- **Instalable** en iOS, Android y escritorio como app nativa
- **Funciona offline** — Precache de todos los assets con Workbox
- **Notificaciones push** — Recordatorios automaticos del dia del ciclo
- **Badge en el icono** — Muestra el numero del dia del ciclo en el icono de la app
- **Actualizacion automatica** — El Service Worker se actualiza silenciosamente

### Notificaciones Push
- **Manana (5:00 AM COT)** — "Dia X del ciclo" para el dia de hoy
- **Noche (7:00 PM COT)** — "Manana: Dia X" para el proximo dia de clases
- **Deduplicacion** — Cada slot se envia una sola vez por dia (TTL 24h en Redis)
- **Auto-limpieza** — Suscripciones invalidas (404/410) se eliminan automaticamente

### Compartir
- **Web Share API** en dispositivos compatibles (share nativo del OS)
- **Fallback a clipboard** con feedback visual en navegadores sin soporte

---

## Arquitectura

```
sek-app/
├── app/                              # Codigo fuente del cliente (Nuxt 4 app dir)
│   ├── assets/css/main.css           # Tailwind CSS 4 — configuracion CSS-first
│   ├── components/
│   │   ├── features/                 # Componentes del calendario
│   │   │   ├── TodayHero.vue         # Hero con dia del ciclo actual
│   │   │   ├── WeekStrip.vue         # Franja semanal lun-vie
│   │   │   ├── MonthGrid.vue         # Calendario mensual con navegacion
│   │   │   ├── DayCell.vue           # Celda individual del grid
│   │   │   ├── DayDetailSheet.vue    # Bottom sheet de detalle
│   │   │   ├── CalendarLegend.vue    # Leyenda de colores
│   │   │   ├── InstallBanner.vue     # Banner de instalacion PWA
│   │   │   └── NotificationBanner.vue # Banner de notificaciones push
│   │   ├── layout/                   # Header, Footer
│   │   └── ui/                       # Componentes reutilizables
│   ├── composables/
│   │   ├── useCalendar.ts            # Logica central del calendario
│   │   ├── useNotifications.ts       # Suscripcion a push notifications
│   │   ├── useAppBadge.ts            # Badge API + Periodic Background Sync
│   │   ├── useShare.ts               # Web Share API + clipboard fallback
│   │   └── useDayDetail.ts           # Estado del bottom sheet
│   ├── data/
│   │   ├── calendar-2025-2026.ts     # Datos del ano escolar completo
│   │   └── constants.ts              # Nombres de meses, dias de la semana
│   ├── layouts/default.vue
│   ├── pages/index.vue
│   └── stores/                       # Pinia stores (navigation, ui)
├── server/                           # API del servidor (Nitro)
│   ├── api/
│   │   ├── today.get.ts              # Dia del ciclo actual (publico)
│   │   └── push/
│   │       ├── send.get.ts           # Envio de notificaciones (cron)
│   │       ├── subscribe.post.ts     # Registro de suscripciones
│   │       ├── unsubscribe.post.ts   # Eliminacion de suscripciones
│   │       ├── test.post.ts          # Envio de prueba (auth requerida)
│   │       └── debug.get.ts          # Diagnostico (auth requerida)
│   └── utils/
│       ├── calendar.ts               # Logica del calendario (server-side)
│       └── redis.ts                  # Cliente Upstash Redis
├── public/
│   ├── sw-push.js                    # Service Worker: push + Badge + Periodic Sync
│   ├── icons/                        # Iconos PWA (192, 512, maskable, apple-touch)
│   └── images/sek-logo.png           # Logo del colegio
├── types/calendar.ts                 # Tipos TypeScript compartidos
├── tests/                            # Tests con Vitest
├── nuxt.config.ts                    # Configuracion Nuxt + PWA
└── vercel.json                       # Cron jobs de Vercel
```

### Flujo de datos del calendario

```
calendar-2025-2026.ts (datos estaticos)
        │
        ├── useCalendar.ts (client)        → Componentes Vue
        │   ├── monthGrid      → MonthGrid + DayCell
        │   ├── currentWeek    → WeekStrip
        │   ├── todayCycleDay  → TodayHero + useAppBadge
        │   └── todayInfo      → DayDetailSheet
        │
        └── server/utils/calendar.ts       → API endpoints
            ├── getTodayInfo()    → /api/today
            ├── getNextSchoolDayInfo() → /api/push/send (evening)
            └── buildNotificationMessage() → Payload de push
```

### Sistema de ciclo rotativo

El colegio opera con un sistema de 6 dias (D1 a D6) que rota de forma continua entre los dias habiles del ano escolar. Los dias especiales (festivos, recesos, vacaciones) **no avanzan** la rotacion — cuando se retoma clases, se continua desde donde quedo el ciclo.

El calendario se genera programaticamente en `calendar-2025-2026.ts` y `server/utils/calendar.ts` iterando cada dia entre agosto 11, 2025 y junio 12, 2026, asignando D1-D6 solo a dias habiles que no sean especiales.

---

## Stack Tecnologico

| Capa | Tecnologia | Version |
|------|------------|---------|
| Framework | Nuxt | 4.3 (compatibilityVersion: 4) |
| CSS | Tailwind CSS | 4.2 (CSS-first, sin config JS) |
| PWA | @vite-pwa/nuxt + Workbox | 1.1 |
| State | Pinia | 3.0 |
| Utilities | VueUse | 14.2 |
| Push | web-push (VAPID) | 3.6 |
| Database | Upstash Redis | 1.36 |
| Deploy | Vercel | Serverless + Cron |
| Tests | Vitest + happy-dom | 4.0 |

### Decisiones tecnicas clave

- **Tailwind CSS-first**: Toda la configuracion de Tailwind se hace en `@theme {}` dentro de `main.css`. No existe `tailwind.config.ts`. Se usa `@tailwindcss/vite` como plugin de Vite.
- **Datos estaticos**: El calendario se define como constante TypeScript, no en base de datos. Los datos son inmutables para un ano escolar y no necesitan CMS.
- **Server-side duplicado**: Los datos del calendario se duplican en `server/utils/calendar.ts` porque Nuxt no permite importar desde `app/` en el servidor. Ambas copias derivan del mismo cronograma oficial.
- **Timezone Colombia**: Todas las fechas se calculan explicitamente en UTC-5 (Colombia) tanto en el cliente como en el servidor, usando `new Date(year, month, day)` para evitar bugs de timezone.

---

## Variables de Entorno

| Variable | Contexto | Descripcion |
|----------|----------|-------------|
| `NUXT_PUBLIC_VAPID_PUBLIC_KEY` | Client + Server | Clave publica VAPID para Web Push |
| `NUXT_VAPID_PRIVATE_KEY` | Server only | Clave privada VAPID |
| `NUXT_CRON_SECRET` | Server only | Secret para autenticacion de cron jobs |
| `CRON_SECRET` | Vercel Cron | Mismo valor que `NUXT_CRON_SECRET` — Vercel lo usa para enviar el header `Authorization: Bearer` |
| `KV_REST_API_URL` | Server only | URL del endpoint REST de Upstash Redis |
| `KV_REST_API_TOKEN` | Server only | Token de autenticacion de Upstash Redis |

### Generar claves VAPID

```bash
npx web-push generate-vapid-keys
```

> **Importante:** Al configurar variables en Vercel, asegurarse de que no tengan caracteres de escape (`\n`) ni espacios en blanco al inicio o final. Usar `printf '%s'` o `/bin/echo -n` al configurar via CLI.

---

## Cron Jobs (Vercel)

Definidos en `vercel.json`:

| Horario (UTC) | Horario (COT) | Endpoint | Funcion |
|---------------|---------------|----------|---------|
| `0 10 * * 1-5` | 5:00 AM L-V | `/api/push/send?slot=morning` | Notifica el dia del ciclo de hoy |
| `0 0 * * 2-6` | 7:00 PM L-V* | `/api/push/send?slot=evening` | Notifica el dia del ciclo de manana |

*El cron de la noche se ejecuta Mar-Sab UTC (que corresponde a Lun-Vie COT a las 7 PM, porque UTC-5 cruza la medianoche).

Vercel envia automaticamente el header `Authorization: Bearer <CRON_SECRET>` en cada request.

---

## Desarrollo Local

### Requisitos
- Node.js >= 18
- pnpm

### Instalacion

```bash
pnpm install
```

### Configuracion

Crear `.env` basado en `.env.example`:

```env
NUXT_PUBLIC_VAPID_PUBLIC_KEY=tu_clave_publica_vapid
NUXT_VAPID_PRIVATE_KEY=tu_clave_privada_vapid
NUXT_CRON_SECRET=un_secret_aleatorio
KV_REST_API_URL=https://tu-redis.upstash.io
KV_REST_API_TOKEN=tu_token_upstash
```

### Comandos

```bash
pnpm dev          # Servidor de desarrollo (http://localhost:3000)
pnpm build        # Build de produccion
pnpm preview      # Preview del build de produccion
pnpm test         # Ejecutar tests
pnpm test:watch   # Tests en modo watch
```

---

## API Endpoints

| Metodo | Ruta | Auth | Descripcion |
|--------|------|------|-------------|
| GET | `/api/today` | No | Dia del ciclo actual (usado por el Service Worker) |
| GET | `/api/push/send` | Bearer | Envia notificaciones push (invocado por cron) |
| POST | `/api/push/subscribe` | No | Registra una suscripcion push |
| POST | `/api/push/unsubscribe` | No | Elimina una suscripcion push |
| POST | `/api/push/test` | Bearer | Envia notificacion de prueba |
| GET | `/api/push/debug` | Bearer | Diagnostico del sistema de push |

---

## Actualizacion para el Proximo Ano Escolar

Para actualizar al ano escolar 2026-2027:

1. **Obtener el cronograma oficial** del Colegio SEK Colombia
2. **Actualizar `app/data/calendar-2025-2026.ts`**:
   - Renombrar archivo a `calendar-2026-2027.ts`
   - Actualizar `SCHOOL_YEAR_START` y `SCHOOL_YEAR_END`
   - Actualizar la lista de `specialDates` con los nuevos festivos, recesos y eventos
   - Actualizar las fechas de vacaciones, Semana Santa, y recesos
3. **Actualizar `server/utils/calendar.ts`**:
   - Aplicar los mismos cambios (este archivo es una copia server-side)
4. **Actualizar importaciones** en `useCalendar.ts` si se renombro el archivo
5. **Actualizar limites de navegacion** en `useCalendar.ts`:
   - `canGoNext` y `canGoPrev` para reflejar el nuevo rango de meses
   - `nextMonth()` y `prevMonth()` para los nuevos limites
6. **Ejecutar los tests** para verificar la integridad del calendario
7. **Deploy** — El deploy en Vercel es automatico al hacer push a `main`

---

## Deploy

El proyecto se despliega en **Vercel** automaticamente con cada push a la rama `main`.

### Servicios externos requeridos
- **Vercel** — Hosting, serverless functions, cron jobs
- **Upstash Redis** — Almacenamiento de suscripciones push y deduplicacion

### Primer deploy

1. Conectar el repositorio a Vercel
2. Configurar todas las variables de entorno listadas arriba
3. Verificar que los cron jobs aparezcan en el dashboard de Vercel
4. Probar la instalacion PWA y las notificaciones push

---

## Licencia

Proyecto privado del Colegio SEK Colombia. Todos los derechos reservados.
