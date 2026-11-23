# Sistema Backend de Turnos y Reservas

API backend completa para gestionar servicios disponibles y reservas de turnos, desarrollada con arquitectura en N-capas, persistencia en MongoDB Atlas, consultas avanzadas con paginación y filtros, relaciones mediante `ObjectId` y `populate`, validaciones con Zod, vistas dinámicas con Handlebars y actualizaciones en tiempo real con Socket.io.

## Tecnologías utilizadas

- **Node.js** (Entorno de ejecución con soporte ESM `import`/`export`)
- **Express** (Framework web y enrutamiento REST)
- **MongoDB Atlas** (Base de datos NoSQL en la nube)
- **Mongoose** (ODM, modelado de esquemas, paginación y `populate`)
- **Zod** (Validación de esquemas de entrada en `body` y `params`)
- **Handlebars (`express-handlebars`)** (Motor de plantillas para vistas)
- **Socket.io** (Comunicación bidireccional en tiempo real mediante WebSockets)
- **Dotenv** (Gestión de variables de entorno)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/giaco747-hue/entrega-final-backend.git](https://github.com/giaco747-hue/entrega-final-backend.git)
   cd entrega-final-backend
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia el archivo `.env.example` incluido en el repositorio:

```env
PORT=8080
APP_NAME=Sistema Backend de Turnos y Reservas
APP_ENV=development
MONGO_URI=tu_uri_de_mongodb
```

> **Nota:** El archivo `.env` contiene credenciales sensibles y está excluido del control de versiones mediante `.gitignore`.

## Ejecución

Para iniciar el servidor en modo desarrollo (con recarga automática):

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

El servidor quedará escuchando por defecto en `http://localhost:8080`.

## Endpoints principales

### Servicios (`/api/services`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/services` | Lista servicios con filtros (`category`, `available`), paginación (`page`, `limit`) y ordenamiento (`sortBy`, `order`). |
| `GET` | `/api/services/:sid` | Obtiene el detalle de un servicio por su `ObjectId`. |
| `POST` | `/api/services` | Crea un nuevo servicio (validado con Zod) y notifica vía Socket.io. |
| `PUT` | `/api/services/:sid` | Actualiza los datos o disponibilidad de un servicio y notifica vía Socket.io. |
| `DELETE` | `/api/services/:sid` | Elimina un servicio por su `ObjectId` y notifica vía Socket.io. |

**Ejemplo de consulta avanzada:**
```text
GET http://localhost:8080/api/services?category=general&available=true&page=1&limit=5&sortBy=price&order=asc
```

### Reservas (`/api/bookings`)

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/bookings` | Lista todas las reservas con sus servicios poblados mediante `populate`. |
| `GET` | `/api/bookings/:bid` | Obtiene una reserva por `ObjectId` expandiendo los datos completos de cada servicio (`populate`). |
| `POST` | `/api/bookings` | Crea una nueva reserva (validada con Zod). |
| `POST` | `/api/bookings/:bid/services/:sid` | Asocia un servicio existente por `ObjectId` a una reserva (incrementa `quantity` si ya existe). |
| `PUT` | `/api/bookings/:bid/services/:sid` | Actualiza la cantidad (`quantity`) de un servicio dentro de una reserva. |
| `DELETE` | `/api/bookings/:bid/services/:sid` | Elimina un servicio puntual de una reserva. |
| `DELETE` | `/api/bookings/:bid` | Elimina una reserva completa por su `ObjectId`. |

### Vistas Web (Handlebars + Socket.io)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/views/services` | Vista web con el listado de servicios registrados en MongoDB Atlas. |
| `GET` | `/views/availability` | Vista en tiempo real conectada a Socket.io que actualiza servicios y disponibilidad sin recargar. |

## Funcionalidades

- **Arquitectura en N-Capas:** Separación estricta de responsabilidades siguiendo el flujo `Routes ➔ Middlewares/Validators ➔ Controllers ➔ Services ➔ Repositories ➔ DAO ➔ Models`.
- **CRUD completo de Servicios y Reservas:** Operaciones completas de creación, lectura, actualización y eliminación con manejo de errores HTTP (`200`, `201`, `400`, `404`, `500`).
- **Relaciones y `populate`:** Las reservas almacenan referencias (`ObjectId` + `quantity`) hacia la colección de servicios y resuelven sus datos completos al consultar.
- **Consultas avanzadas:** Filtrado dinámico por categoría y disponibilidad, ordenamiento ascendente/descendente y metadatos de paginación (`totalDocs`, `limit`, `page`, `totalPages`, `hasPrevPage`, `hasNextPage`).
- **Validaciones con Zod:** Middleware reutilizable que valida tanto cuerpos de petición (`body`) como identificadores de ruta (`params`) antes de llegar a los controladores.
- **Tiempo real con WebSockets:** Emisión automática de eventos Socket.io al crear, actualizar o eliminar servicios y reservas.

## Notas adicionales

- Para probar los endpoints de la API se recomienda utilizar **Thunder Client** o **Postman** enviando los payloads en formato `application/json`.
- El proyecto cumple con las buenas prácticas de seguridad manteniendo `.env` y `node_modules/` fuera del repositorio e incluyendo `.env.example` como plantilla de configuración.