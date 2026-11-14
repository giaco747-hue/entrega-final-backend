import { Router } from 'express';
import { createBooking, getBookingById, addServiceToBooking } from '../controllers/bookings.controller.js';
import { validateSchema } from '../middlewares/validator.middleware.js';
import {
    createBookingSchema,
    addServiceToBookingParamsSchema,
    addServiceToBookingBodySchema
} from '../validators/schemas.js';

const router = Router();

router.post('/', validateSchema(createBookingSchema), createBooking);
router.get('/:bid', getBookingById);
router.post(
    '/:bid/services/:sid',
    validateSchema(addServiceToBookingParamsSchema, 'params'),
    validateSchema(addServiceToBookingBodySchema, 'body'),
    addServiceToBooking
);

export default router;