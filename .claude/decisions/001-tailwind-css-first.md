# ADR-001: Tailwind CSS-First Configuration

## Estado
Aceptada

## Contexto
Tailwind CSS v4 introduce la configuracion CSS-first como metodo recomendado, reemplazando el archivo `tailwind.config.ts` de versiones anteriores.

## Decision
Usar configuracion CSS-first exclusivamente via `@tailwindcss/vite`. No crear `tailwind.config.ts`. No usar `@nuxtjs/tailwindcss` (incompatible con Tailwind v4).

## Consecuencias

### Positivas
- Alineado con la direccion de Tailwind v4
- Toda la configuracion de diseno vive en un solo archivo CSS
- Mas intuitivo: los tokens son variables CSS nativas
- Compatible con CSS custom properties en runtime

### Negativas
- Requiere conocimiento de la nueva sintaxis `@theme`
- Plugins que dependan de config JS no funcionaran directamente

## Referencia
- https://tailwindcss.com/docs/installation/framework-guides/nuxt
