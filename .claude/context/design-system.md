# Sistema de Diseno - SEK App

## Configuracion Tailwind CSS-First

**IMPORTANTE**: Este proyecto usa Tailwind 4 con configuracion CSS-first.
- NO existe `tailwind.config.ts`
- Toda la configuracion esta en `app/assets/css/main.css`
- Los tokens se definen en `@theme { }`

## Colores (definidos en @theme)

| Token          | Hex       | Uso                          |
|----------------|-----------|------------------------------|
| `primary`      | `#263060` | Navy SEK — headers, CTAs     |
| `secondary`    | `#2874fc` | Blue brillante — links, hover|
| `accent`       | `#7a00df` | Purpura — acentos modernos   |
| `gold`         | `#f3b600` | Dorado — highlights, badges  |

### Uso en clases Tailwind
```
bg-primary text-primary border-primary
bg-secondary text-secondary
bg-accent text-accent
bg-gold text-gold
```

## Tipografia

- **Font family:** Lato (sans-serif)
- Definida en `@theme { --font-sans: 'Lato', ... }`

## Componentes CSS definidos

| Clase          | Descripcion                              |
|----------------|------------------------------------------|
| `.container-app` | Contenedor con max-width y padding     |
| `.btn-primary`   | Boton principal (bg-primary, white text)|
| `.btn-outline`   | Boton outline (borde primary)          |

## Para agregar nuevos tokens

Editar `app/assets/css/main.css` en la seccion `@theme`:

```css
@theme {
  --color-nuevo: #XXXXXX;
}
```

Luego usar como `bg-nuevo`, `text-nuevo`, etc.
