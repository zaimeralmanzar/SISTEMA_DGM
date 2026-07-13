# Portal Web DGM — Sistema de Gestión Migratoria

Portal web ciudadano para la Dirección General de Migración de República Dominicana. Proyecto académico de demostración.

## Tecnologías

- React 18 + Vite + TypeScript
- React Router v6
- CSS Modules
- Context API
- Vitest + React Testing Library
- Lucide React

## Arquitectura

```
src/
├── app/           # Punto de entrada
├── components/    # Componentes reutilizables (common, forms, layout)
├── contexts/      # AuthContext, NotificationContext
├── data/          # Datos simulados
├── layouts/       # PublicLayout, PortalLayout, AnalystLayout
├── models/        # Tipos TypeScript
├── pages/         # Páginas por sección (public, auth, citizen, analyst)
├── routes/        # ProtectedRoute
├── services/      # Capa de servicios (mocks intercambiables)
├── styles/        # Variables CSS y estilos globales
└── utils/         # Validaciones y formateo
```

## Requisitos

- Node.js 18+
- npm 8+

## Instalación

```bash
cd src/PortalDGM.Web
npm install
```

## Ejecución

```bash
npm run dev       # Servidor de desarrollo en http://localhost:5173
npm run build     # Build de producción
npm run test      # Ejecutar pruebas
npm run lint      # Verificar calidad de código
```

## Variables de entorno

Copia `.env.example` a `.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_USE_MOCKS=true
```

Cuando `VITE_USE_MOCKS=true`, el sistema usa datos simulados sin requerir backend.

## Usuarios de prueba

| Rol       | Correo                  | Contraseña  |
|-----------|-------------------------|-------------|
| Ciudadano | ciudadano@dgm.demo      | Demo1234*   |
| Analista  | analista@dgm.demo       | Demo1234*   |

## Rutas principales

| Ruta                            | Descripción                    |
|---------------------------------|-------------------------------|
| `/`                             | Página principal               |
| `/servicios`                    | Catálogo de servicios          |
| `/servicios/:id`                | Detalle del servicio           |
| `/login`                        | Inicio de sesión               |
| `/registro`                     | Registro                       |
| `/verificar-documento`          | Verificación pública           |
| `/calculadora-estadia`          | Calculadora de sobreestadía    |
| `/eticket`                      | E-Ticket público               |
| `/portal`                       | Dashboard ciudadano            |
| `/portal/tramites`              | Mis trámites                   |
| `/portal/tramites/nuevo/:id`    | Nueva solicitud                |
| `/portal/tramites/:id`          | Detalle del trámite            |
| `/portal/citas`                 | Mis citas                      |
| `/portal/pagos`                 | Pagos                          |
| `/portal/notificaciones`        | Notificaciones                 |
| `/portal/perfil`                | Mi perfil                      |
| `/portal/eticket`               | E-Ticket ciudadano             |
| `/analista`                     | Dashboard analista             |
| `/analista/solicitudes`         | Gestión de solicitudes         |
| `/analista/solicitudes/:id`     | Detalle expediente             |

## Cómo reemplazar mocks por API real

En `src/services/index.ts`, reemplaza las importaciones mock por implementaciones HTTP:

```typescript
// Implementar httpAuthService que consuma:
// POST /api/v1/auth/login
// POST /api/v1/auth/register
// GET  /api/v1/applications
// etc.
```

Establece `VITE_USE_MOCKS=false` para activar las implementaciones HTTP.

## Endpoints previstos

```
GET  /api/v1/services
POST /api/v1/applications
GET  /api/v1/applications/:id
POST /api/v1/appointments
POST /api/v1/payments
POST /api/v1/etickets
GET  /api/v1/documents/verify/:code
POST /api/v1/overstay/calculate
```

## Limitaciones académicas

- Autenticación simulada — no usar datos reales
- Pagos simulados — no introduce datos financieros reales
- Los trámites y documentos son de demostración
- La validación definitiva de reglas migratorias corresponde al sistema central
- No conectado al backend real de la DGM

## Aviso

Este portal es un proyecto académico de demostración. No está afiliado con la Dirección General de Migración real de República Dominicana.
