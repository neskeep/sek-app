# SEK App - Calendario Escolar SEK Colombia

## Descripcion
PWA del calendario escolar del Colegio SEK Colombia con sistema rotativo de 6 dias (ano escolar 2025-2026). Deploy en GitHub Pages.

## Stack
- **Framework:** Nuxt 4 (compatibilityVersion: 4)
- **CSS:** Tailwind CSS 4 via `@tailwindcss/vite` (configuracion CSS-first, NO existe tailwind.config.ts)
- **PWA:** @vite-pwa/nuxt (Workbox generateSW + precache)
- **State:** Pinia
- **Utilities:** VueUse
- **Validation:** Zod
- **Package Manager:** pnpm
- **Deploy:** GitHub Pages via GitHub Actions

## Estructura del Proyecto

```
sek-app/
├── app/                          # Codigo fuente (Nuxt 4 app dir)
│   ├── assets/css/main.css       # Config Tailwind CSS-first (@theme)
│   ├── components/
│   │   ├── ui/                   # Componentes reutilizables (botones, cards, etc)
│   │   ├── layout/               # Header, Footer
│   │   └── features/             # TodayHero, MonthGrid, DayCell, WeekStrip, CalendarLegend
│   ├── composables/
│   │   └── useCalendar.ts        # Logica principal del calendario
│   ├── data/
│   │   └── calendar-2025-2026.ts # Data del ano escolar (220 entradas)
│   ├── layouts/                  # Layouts de pagina
│   ├── pages/                    # Rutas del sitio
│   └── stores/                   # Stores Pinia
├── types/
│   ├── index.ts                  # Types generales
│   └── calendar.ts               # CycleDay, SpecialDayType, CalendarDayInfo, CalendarDayEntry
├── public/
│   ├── images/sek-logo.png       # Logo del colegio
│   └── icons/                    # Iconos PWA (192, 512, apple-touch)
├── .github/workflows/deploy.yml  # Deploy a GitHub Pages
└── .claude/                      # Documentacion del proyecto
```

## Archivos Clave
- `nuxt.config.ts` — Configuracion de Nuxt, modulos, PWA, baseURL
- `app/assets/css/main.css` — Tailwind CSS-first (theme tokens, colores, animaciones)
- `app/data/calendar-2025-2026.ts` — Data del calendario (ciclo D1-D6, festivos, recesos, etc)
- `app/composables/useCalendar.ts` — Composable reactivo con toda la API
- `types/calendar.ts` — Tipos del calendario

## Convenciones
- **NO crear** `tailwind.config.ts` — toda config de Tailwind va en `main.css` con `@theme {}`
- **NO usar** `@nuxtjs/tailwindcss` — se usa `@tailwindcss/vite` como plugin de Vite
- **NO hardcodear** datos repetidos — usar stores de Pinia o data files
- **Colores** se definen como `--color-nombre` en `@theme` y se usan como `bg-nombre`, `text-nombre`
- **Componentes** siguen la convencion de carpetas: `ui/`, `layout/`, `features/`
- **Auto-imports** habilitados para composables, stores y utils
- **Fechas** usar `new Date(year, month, day)` (NO parsear strings) para evitar bugs de timezone
- **Google Fonts** @import va ANTES de @import "tailwindcss" en main.css

## Contexto Detallado
- [Sistema de Diseno](.claude/context/design-system.md)
- [Decision: Tailwind CSS-First](.claude/decisions/001-tailwind-css-first.md)

## Comandos
- `pnpm dev` — Servidor de desarrollo
- `pnpm build` — Build de produccion
- `pnpm generate` — Build estatico para GitHub Pages (.output/public/)
- `pnpm preview` — Preview del build
