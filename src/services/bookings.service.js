import BookingsRepository from '../repositories/bookings.repository.js';
import ServicesRepository from '../repositories/services.repository.js';

const bookingsRepository = new BookingsRepository();
const servicesRepository = new ServicesRepository();

export default class BookingsService {
    async getBookings(query = {}) {
        return await bookingsRepository.getBookings(query);
    }

    async createBooking(bookingData) {
        return await bookingsRepository.create(bookingData);
    }

    async getBookingById(id) {
        return await bookingsRepository.getById(id);
    }

    async addServiceToBooking(bookingId, serviceId) {
        
        const serviceExists = await servicesRepository.getById(serviceId);
        if (!serviceExists) {
            throw new Error('SERVICE_NOT_FOUND');
        }

        
        const booking = await bookingsRepository.getById(bookingId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        
        const existingServiceIndex = booking.services.findIndex((s) => {
            const currentId = s.service?._id ? s.service._id.toString() : s.service?.toString();
            return currentId === serviceId.toString();
        });

        if (existingServiceIndex !== -1) {
            booking.services[existingServiceIndex].quantity += 1;
        } else {
            booking.services.push({ service: serviceId, quantity: 1 });
        }

        
        const normalizedServices = booking.services.map((item) => ({
            service: item.service?._id || item.service,
            quantity: item.quantity
        }));

        return await bookingsRepository.update(bookingId, { services: normalizedServices });
    }
}