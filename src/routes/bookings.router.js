import { Router } from 'express';
import {
    getBookings,
    createBooking,
    getBookingById,
    addServiceToBooking,
    updateServiceQuantity,
    removeServiceFromBooking,
    deleteBooking
} from '../controllers/bookings.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
    createBookingSchema,
    bookingIdParamSchema,
    addServiceToBookingParamsSchema,
    addServiceToBookingBodySchema,
    updateServiceQuantitySchema
} from '../validators/schemas.js';

const router = Router();

router.get('/', getBookings);
router.get('/:bid', validateSchema(bookingIdParamSchema, 'params'), getBookingById);
router.post('/', validateSchema(createBookingSchema, 'body'), createBooking);
router.post(
    '/:bid/services/:sid',
    validateSchema(addServiceToBookingParamsSchema, 'params'),
    validateSchema(addServiceToBookingBodySchema, 'body'),
    addServiceToBooking
);
router.put(
    '/:bid/services/:sid',
    validateSchema(addServiceToBookingParamsSchema, 'params'),
    validateSchema(updateServiceQuantitySchema, 'body'),
    updateServiceQuantity
);
router.delete(
    '/:bid/services/:sid',
    validateSchema(addServiceToBookingParamsSchema, 'params'),
    removeServiceFromBooking
);
router.delete('/:bid', validateSchema(bookingIdParamSchema, 'params'), deleteBooking);

export default router;