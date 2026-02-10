# L'Élite Gastro

Proyecto React modular construido a partir del archivo legado `prueba2.html`.

## Ejecutar

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
npm run preview
```

## Estructura

```text
src/
  app/            # Orquestacion de la app y store principal
  domain/         # Datos, constantes, reglas puras y selectores
  state/          # Reducer y acciones (patron Flux)
  features/       # Vistas y modulos por dominio
  shared/         # Componentes y utilidades reutilizables
```

## Notas

- Archivo legado preservado: `docs/prueba2.legacy.react.jsx`.
- Archivo original sin tocar: `prueba2.html`.
