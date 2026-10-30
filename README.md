# Web Application Test

Aplicación web de mapas interactivos construida con Vue 3, Vite, Tailwind CSS/DaisyUI y Express.

## Tecnologías

- **Frontend**: Vue 3 + TypeScript + Vite
- **Estilos**: Tailwind CSS + DaisyUI
- **Backend**: Express.js
- **Mapas**: Leaflet

## Instalación

```bash
# Con bun
bun install

# Con npm
npm install

# Con pnpm
pnpm install
```

## Iniciar la aplicación

Para iniciar tanto el frontend como el servidor backend en modo desarrollo:

```bash
# Con bun
bun run dev

# Con npm
npm run dev

# Con pnpm
pnpm dev
```

Este comando inicia simultáneamente:
- El servidor de desarrollo de Vite (frontend)
- El servidor Express (backend) con hot reload

## Scripts adicionales

- `bun run dev:web` - Solo frontend
- `bun run dev:api` - Solo backend
- `bun run build` - Compilar para producción
- `bun run preview` - Previsualizar build de producción
