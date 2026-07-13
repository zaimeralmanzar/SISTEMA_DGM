# Endpoints requeridos por el Portal Web

El portal React (`PortalDGM.Web`) espera que Integration exponga una API REST en:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login ciudadano/analista → devuelve JWT |
| POST | `/api/v1/auth/register` | Registro de ciudadano |
| GET | `/api/v1/auth/me` | Datos del usuario autenticado (requiere JWT) |

**Login request:**
```json
{ "email": "string", "password": "string" }
```
**Login response:**
```json
{ "success": true, "data": { "token": "jwt...", "user": { "id", "email", "nombres", "apellidos", "cedula", "pasaporte", "nacionalidad", "telefono", "role": "citizen|analyst" } } }
```

Roles posibles: `citizen` (ciudadano del portal) y `analyst` (analista DGM).

---

## Servicios (catálogo, público)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/services` | Lista de todos los servicios |
| GET | `/api/v1/services/{id}` | Detalle de un servicio |

Cada servicio debe tener: `id`, `code`, `name`, `category`, `targetAudience`, `description`, `estimatedCost`, `currency`, `responseTime`, `modality`, `requirements[]`.

---

## Expedientes / Solicitudes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/applications` | Lista (ciudadano ve los suyos; analista ve todos) |
| POST | `/api/v1/applications` | Crear solicitud nueva |
| GET | `/api/v1/applications/{id}` | Detalle de una solicitud |
| PATCH | `/api/v1/applications/{id}/status` | Cambiar estado (solo analista) |

**Estados válidos:** `draft`, `submitted`, `under_review`, `observed`, `correction_sent`, `approved`, `pending_payment`, `paid`, `document_issued`, `delivered`, `rejected`, `expired`

**Transiciones permitidas:**
- `draft` → `submitted`
- `submitted` → `under_review` | `rejected`
- `under_review` → `observed` | `approved` | `rejected`
- `observed` → `correction_sent` | `rejected`
- `correction_sent` → `under_review`
- `approved` → `pending_payment`
- `pending_payment` → `paid`
- `paid` → `document_issued`
- `document_issued` → `delivered`

**PATCH body:**
```json
{ "estado": "under_review", "comentario": "opcional" }
```

---

## Citas

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/appointments` | Citas del ciudadano autenticado |
| POST | `/api/v1/appointments` | Agendar cita |
| DELETE | `/api/v1/appointments/{id}` | Cancelar cita |

---

## Pagos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/payments` | Pagos del ciudadano autenticado |
| POST | `/api/v1/payments` | Registrar pago → llama a `IPagoService.RegistrarPagoAsync` |

El POST de pago debe internamente llamar `IPagoService` (ya implementado en `ApiPagoService`). Devolver error si el expediente no está en estado `pending_payment`.

---

## E-Tickets (turno virtual)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/etickets` | Tickets del ciudadano |
| POST | `/api/v1/etickets` | Emitir ticket de turno |

---

## Documentos y Sobreestadía (públicos)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/documents/verify/{code}` | Verifica autenticidad de documento emitido |
| POST | `/api/v1/overstay/calculate` | Calcula multa por sobreestadía → llama a `IMovimientoMigratorioService` |

**Overstay request:**
```json
{ "pasaporte": "P1234567", "cedula": "", "fechaEntrada": "2024-01-01" }
```

---

## Notificaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/notifications` | Notificaciones del ciudadano |
| PATCH | `/api/v1/notifications/{id}/read` | Marcar como leída |
| PATCH | `/api/v1/notifications/read-all` | Marcar todas como leídas |

---

## Servicios de Integration ya disponibles

La persona de integración puede inyectar directamente:

| Interfaz | Implementación | Uso |
|----------|---------------|-----|
| `IPersonaService` | `ApiPersonaService` | Buscar ciudadano por cédula/pasaporte |
| `IPagoService` | `ApiPagoService` | Registrar pagos (offline-first) |
| `ITarifaService` | `ApiTarifaService` | Consultar monto de servicio |
| `IMovimientoMigratorioService` | `ApiMovimientoMigratorioService` | Registrar movimientos / calcular sobreestadía |
| `IAuthService` | `ApiAuthService` | Login de usuarios Caja (puede reutilizarse o separarse para ciudadanos) |

---

## CORS

Debe configurar CORS para aceptar peticiones desde:
- `http://localhost:5173` (desarrollo Vite)
- `http://localhost:4173` (preview Vite)

## Autenticación

JWT Bearer token. El portal envía el token en el header:
```
Authorization: Bearer <token>
```
