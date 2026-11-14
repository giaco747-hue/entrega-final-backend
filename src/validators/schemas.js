import { z } from 'zod';


const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Esquema para CREAR un servicio (POST /api/services)
export const createServiceSchema = z.object({
    name: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre debe tener al menos 2 caracteres'),
    category: z.string({ required_error: 'La categoría es obligatoria' }).min(2, 'La categoría debe tener al menos 2 caracteres'),
    description: z.string({ required_error: 'La descripción es obligatoria' }).min(5, 'La descripción debe tener al menos 5 caracteres'),
    duration: z.number({ required_error: 'La duración es obligatoria', invalid_type_error: 'La duración debe ser un número' }).positive('La duración debe ser mayor a 0'),
    price: z.number({ required_error: 'El precio es obligatorio', invalid_type_error: 'El precio debe ser un número' }).nonnegative('El precio no puede ser negativo'),
    available: z.boolean({ invalid_type_error: 'El campo available debe ser booleano (true o false)' }).default(true)
});

// 2. Esquema para ACTUALIZAR un servicio (PUT /api/services/:sid)
export const updateServiceSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    category: z.string().min(2, 'La categoría debe tener al menos 2 caracteres').optional(),
    description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres').optional(),
    duration: z.number({ invalid_type_error: 'La duración debe ser un número' }).positive('La duración debe ser mayor a 0').optional(),
    price: z.number({ invalid_type_error: 'El precio debe ser un número' }).nonnegative('El precio no puede ser negativo').optional(),
    available: z.boolean({ invalid_type_error: 'El campo available debe ser booleano (true o false)' }).optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: 'Debes enviar al menos un campo válido para actualizar el servicio'
});

// 3. Esquema para CREAR una reserva (POST /api/bookings)
export const createBookingSchema = z.object({
    clientName: z.string({ required_error: 'El nombre del cliente es obligatorio' }).min(2, 'El nombre del cliente debe tener al menos 2 caracteres'),
    email: z.string({ required_error: 'El email es obligatorio' }).email('El formato del email no es válido'),
    date: z.string({ required_error: 'La fecha es obligatoria' }).min(1, 'La fecha no puede estar vacía'),
    time: z.string({ required_error: 'La hora es obligatoria' }).min(1, 'La hora no puede estar vacía'),
    status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
    services: z.array(
        z.object({
            service: z.string().regex(objectIdRegex, 'El ID del servicio no es un ObjectId válido'),
            quantity: z.number().int().positive().default(1)
        })
    ).optional()
});

// 4. Esquemas para AGREGAR SERVICIO A RESERVA (POST /api/bookings/:bid/services/:sid)
export const addServiceToBookingParamsSchema = z.object({
    bid: z.string().regex(objectIdRegex, 'El ID de la reserva (bid) no es un ObjectId válido'),
    sid: z.string().regex(objectIdRegex, 'El ID del servicio (sid) no es un ObjectId válido')
});

export const addServiceToBookingBodySchema = z.object({
    quantity: z.number({ invalid_type_error: 'La cantidad debe ser un número' }).int('La cantidad debe ser un número entero').positive('La cantidad debe ser mayor a 0').optional()
}).optional();