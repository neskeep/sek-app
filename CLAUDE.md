# SEK App - Calendario Escolar SEK Colombia

## Descripcion
Calendario escolar del Colegio SEK Colombia con sistema rotativo de 6 dias.

## Stack
- **Framework:** Nuxt 4 (compatibilityVersion: 4)
- **CSS:** Tailwind CSS 4 via `@tailwindcss/vite` (configuracion CSS-first, NO existe tailwind.config.ts)
- **State:** Pinia
- **Utilities:** VueUse
- **Validation:** Zod
- **Package Manager:** pnpm

## Estructura del Proyecto

```
sek-app/
├── app/                          # Codigo fuente (Nuxt 4 app dir)
│   ├── assets/css/main.css       # Config Tailwind CSS-first (@theme)
│   ├── components/
│   │   ├── ui/                   # Componentes reutilizables (botones, cards, etc)
│   │   ├── layout/               # Header, Footer, Sidebar
│   │   └── features/             # Componentes especificos del negocio
│   ├── composables/              # Logica reutilizable
│   ├── layouts/                  # Layouts de pagina
│   ├── pages/                    # Rutas del sitio
│   └── stores/                   # Stores Pinia
├── server/                       # API y server utils
│   ├── api/
│   └── utils/
├── types/                        # TypeScript types compartidos
├── utils/                        # Utilidades compartidas
├── public/                       # Assets estaticos
└── .claude/                      # Documentacion del proyecto
    ├── context/                  # Contexto modular
    │   └── design-system.md      # Tokens de diseno y colores
    ├── decisions/                # Decisiones arquitectonicas
    │   └── 001-tailwind-css-first.md
    └── state/                    # Estado de sesion
```

## Archivos Clave
- `nuxt.config.ts` — Configuracion de Nuxt y modulos
- `app/assets/css/main.css` — Configuracion Tailwind CSS-first (theme tokens, colores, componentes)
- `app/stores/navigation.ts` — Items de navegacion
- `app/stores/ui.ts` — Estado global de UI

## Convenciones
- **NO crear** `tailwind.config.ts` — toda config de Tailwind va en `main.css` con `@theme {}`
- **NO usar** `@nuxtjs/tailwindcss` — se usa `@tailwindcss/vite` como plugin de Vite en `nuxt.config.ts`
- **NO hardcodear** datos repetidos — usar stores de Pinia
- **Colores** se definen como `--color-nombre` en `@theme` y se usan como `bg-nombre`, `text-nombre`
- **Componentes** siguen la convencion de carpetas: `ui/`, `layout/`, `features/`
- **Auto-imports** habilitados para composables, stores y utils

## Contexto Detallado
- [Sistema de Diseno](.claude/context/design-system.md)
- [Decision: Tailwind CSS-First](.claude/decisions/001-tailwind-css-first.md)

## Comandos
- `pnpm dev` — Servidor de desarrollo
- `pnpm build` — Build de produccion
- `pnpm preview` — Preview del build
