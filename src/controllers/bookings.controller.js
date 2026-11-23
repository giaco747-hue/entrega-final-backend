import BookingsService from '../services/bookings.service.js';

const bookingsService = new BookingsService();

export const getBookings = async (req, res) => {
    try {
        const bookings = await bookingsService.getBookings(req.query);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

export const createBooking = async (req, res) => {
    try {
        const newBooking = await bookingsService.createBooking(req.body);

        const io = req.app.get('socketio');
        if (io) {
            const updatedBookings = await bookingsService.getBookings({});
            io.emit('updateBookings', updatedBookings);
        }

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const id = req.params.bid;
        const booking = await bookingsService.getBookingById(id);

        if (!booking) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la reserva' });
    }
};

export const addServiceToBooking = async (req, res) => {
    try {
        const bookingId = req.params.bid;
        const serviceId = req.params.sid;
        const quantity = req.body?.quantity || 1;

        const updatedBooking = await bookingsService.addServiceToBooking(bookingId, serviceId, quantity);

        const io = req.app.get('socketio');
        if (io) {
            const updatedBookings = await bookingsService.getBookings({});
            io.emit('updateBookings', updatedBookings);
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        if (error.message === 'SERVICE_NOT_FOUND') {
            return res.status(404).json({ error: 'El servicio que intentas agregar no existe' });
        }
        if (error.message === 'BOOKING_NOT_FOUND') {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(500).json({ error: 'Error al agregar el servicio a la reserva' });
    }
};

export const updateServiceQuantity = async (req, res) => {
    try {
        const { bid, sid } = req.params;
        const { quantity } = req.body;

        const updatedBooking = await bookingsService.updateServiceQuantity(bid, sid, quantity);

        const io = req.app.get('socketio');
        if (io) {
            const updatedBookings = await bookingsService.getBookings({});
            io.emit('updateBookings', updatedBookings);
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        if (error.message === 'BOOKING_NOT_FOUND') {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        if (error.message === 'SERVICE_NOT_IN_BOOKING') {
            return res.status(404).json({ error: 'El servicio no está asociado a esta reserva' });
        }
        res.status(500).json({ error: 'Error al actualizar la cantidad del servicio' });
    }
};

export const removeServiceFromBooking = async (req, res) => {
    try {
        const { bid, sid } = req.params;

        const updatedBooking = await bookingsService.removeServiceFromBooking(bid, sid);

        const io = req.app.get('socketio');
        if (io) {
            const updatedBookings = await bookingsService.getBookings({});
            io.emit('updateBookings', updatedBookings);
        }

        res.status(200).json(updatedBooking);
    } catch (error) {
        if (error.message === 'BOOKING_NOT_FOUND') {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        if (error.message === 'SERVICE_NOT_IN_BOOKING') {
            return res.status(404).json({ error: 'El servicio no está asociado a esta reserva' });
        }
        res.status(500).json({ error: 'Error al eliminar el servicio de la reserva' });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { bid } = req.params;
        const deletedBooking = await bookingsService.deleteBooking(bid);

        const io = req.app.get('socketio');
        if (io) {
            const updatedBookings = await bookingsService.getBookings({});
            io.emit('updateBookings', updatedBookings);
        }

        res.status(200).json({
            message: 'Reserva eliminada correctamente',
            booking: deletedBooking
        });
    } catch (error) {
        if (error.message === 'BOOKING_NOT_FOUND') {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};