# Sistema Backend de Turnos y Reservas

API REST desarrollada con Node.js, Express y MongoDB (Mongoose) bajo una arquitectura estricta en N-Capas (`Router ➔ Controller ➔ Service ➔ DAO`). Incorpora consultas avanzadas con paginación, validaciones de entrada con Zod, relaciones entre colecciones con `populate`, renderizado de vistas con Handlebars y actualización en tiempo real con Socket.io.

## Instalación y Arranque

1. Clonar el repositorio público.
2. Instalar las dependencias ejecutando:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` y configurar la cadena de conexión a MongoDB y el puerto del servidor (`PORT=8080`).
4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

---

## 1. Consultas Avanzadas en Servicios (`GET /api/services`)

El endpoint de listado de servicios soporta filtros dinámicos, paginación y ordenamiento mediante *query params*:

* `category`: Filtra por categoría exacta (ej. `mecanica`, `estetica`).
* `available`: Filtra por disponibilidad (`true` o `false`).
* `page`: Número de página a consultar (por defecto `1`).
* `limit`: Cantidad de resultados por página (por defecto `10`).
* `sortBy`: Campo por el cual ordenar (ej. `price`, `duration`, `name`).
* `order`: Dirección del ordenamiento (`asc` para ascendente, `desc` para descendente).

### Ejemplos de uso
* **Filtrar por categoría y disponibilidad:**
  `GET http://localhost:8080/api/services?category=mecanica&available=true`
* **Paginar y ordenar por precio ascendente:**
  `GET http://localhost:8080/api/services?page=1&limit=5&sortBy=price&order=asc`
* **Consulta combinada completa:**
  `GET http://localhost:8080/api/services?category=mecanica&available=true&page=1&limit=5&sortBy=price&order=desc`

### Estructura de respuesta (Metadatos de paginación)
```json
{
  "docs": [
    {
      "_id": "6734a1b2c3d4e5f6a7b8c9d0",
      "name": "Alineación y Balanceo",
      "category": "mecanica",
      "description": "Ajuste completo de tren delantero y balanceo de ruedas",
      "duration": 60,
      "price": 120,
      "available": true
    }
  ],
  "totalDocs": 12,
  "limit": 5,
  "totalPages": 3,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevPage": null,
  "nextPage": 2
}
```

---

## 2. Validaciones Aplicadas con Zod

Las validaciones se ejecutan mediante el middleware `validateSchema` (`src/middlewares/validator.middleware.js`) y los esquemas definidos en `src/validators/schemas.js`, interceptando los datos antes de alcanzar el controlador o MongoDB. Si algún campo es inválido o falta, la API responde inmediatamente con código **`400 Bad Request`**.

### Endpoints protegidos
1. **Crear servicio (`POST /api/services`):** Valida `name` (mín. 2 caracteres), `category` (mín. 2 caracteres), `description` (mín. 5 caracteres), `duration` (número positivo), `price` (número mayor o igual a 0) y `available` (booleano).
2. **Actualizar servicio (`PUT /api/services/:sid`):** Valida los tipos de los campos enviados y exige que al menos un campo válido esté presente en el cuerpo de la petición.
3. **Crear reserva (`POST /api/bookings`):** Valida `clientName` (mín. 2 caracteres), `email` (formato de correo válido), `date` (string no vacío), `time` (string no vacío), `status` (`pending`, `confirmed` o `cancelled`) y el arreglo opcional `services` con formato `ObjectId`.
4. **Agregar servicio a reserva (`POST /api/bookings/:bid/services/:sid`):** Valida en los parámetros de ruta que tanto `:bid` como `:sid` tengan formato válido de `ObjectId` de MongoDB (24 caracteres hexadecimales), y opcionalmente `quantity` (entero positivo) en el cuerpo.

### Ejemplo de respuesta ante error de validación (`400 Bad Request`)
```json
{
  "error": "Error de validación en los datos enviados",
  "details": [
    {
      "field": "email",
      "message": "El formato del email no es válido"
    }
  ]
}
```

---

## 3. Modelo de Reservas y Consulta con `populate`

En la colección `bookings`, los servicios asociados no se duplican como objetos completos; se almacenan exclusivamente como referencias mediante su `ObjectId` y cantidad (`{ service: ObjectId, quantity: Number }`).

### Consultar una reserva con servicios completos (`GET /api/bookings/:bid`)
Al consultar una reserva por su ID, el DAO aplica `.populate('services.service')` para resolver las referencias y devolver los datos completos de cada servicio junto con la información de la reserva.

* **Petición:**
  `GET http://localhost:8080/api/bookings/6734b9e8f1a2b3c4d5e6f7a8`

* **Respuesta (`200 OK`):**
```json
{
  "_id": "6734b9e8f1a2b3c4d5e6f7a8",
  "clientName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "date": "2026-11-20",
  "time": "10:30",
  "status": "pending",
  "services": [
    {
      "_id": "6734ba10f1a2b3c4d5e6f7b1",
      "service": {
        "_id": "6734a1b2c3d4e5f6a7b8c9d0",
        "name": "Alineación y Balanceo",
        "category": "mecanica",
        "description": "Ajuste completo de tren delantero y balanceo de ruedas",
        "duration": 60,
        "price": 120,
        "available": true
      },
      "quantity": 1
    }
  ]
}
```

---

## 4. Vistas y Tiempo Real (Handlebars + Socket.io)

* **Vista de Servicios:** `http://localhost:8080/views/services`
* **Vista de Reservas:** `http://localhost:8080/views/availability`