# Mock DB JSON

Este directorio es la fuente de datos local para desarrollo.

- Cada entidad está separada por archivo JSON (`tables`, `workers`, `inventory`, etc.).
- El mapeo tipado vive en `src/domain/mockData.ts`.
- El bootstrap de app usa el repositorio `jsonRestaurantBootstrapRepository`.

## Migración futura a backend

1. Implementar un repositorio HTTP que cumpla `RestaurantBootstrapRepository`.
2. Reemplazar la instancia inyectada en `bootstrapService`.
3. Mantener intactas UI, slices y selectores.

Con esto, la transición a API/DB real no requiere reescritura del frontend.
