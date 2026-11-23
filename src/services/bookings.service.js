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

    async addServiceToBooking(bookingId, serviceId, quantity = 1) {
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
            booking.services[existingServiceIndex].quantity += quantity;
        } else {
            booking.services.push({ service: serviceId, quantity });
        }

        const normalizedServices = booking.services.map((item) => ({
            service: item.service?._id || item.service,
            quantity: item.quantity
        }));

        return await bookingsRepository.update(bookingId, { services: normalizedServices });
    }

    async updateServiceQuantity(bookingId, serviceId, quantity) {
        const booking = await bookingsRepository.getById(bookingId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        const serviceIndex = booking.services.findIndex((s) => {
            const currentId = s.service?._id ? s.service._id.toString() : s.service?.toString();
            return currentId === serviceId.toString();
        });

        if (serviceIndex === -1) {
            throw new Error('SERVICE_NOT_IN_BOOKING');
        }

        booking.services[serviceIndex].quantity = quantity;

        const normalizedServices = booking.services.map((item) => ({
            service: item.service?._id || item.service,
            quantity: item.quantity
        }));

        return await bookingsRepository.update(bookingId, { services: normalizedServices });
    }

    async removeServiceFromBooking(bookingId, serviceId) {
        const booking = await bookingsRepository.getById(bookingId);
        if (!booking) {
            throw new Error('BOOKING_NOT_FOUND');
        }

        const serviceExistsInBooking = booking.services.some((s) => {
            const currentId = s.service?._id ? s.service._id.toString() : s.service?.toString();
            return currentId === serviceId.toString();
        });

        if (!serviceExistsInBooking) {
            throw new Error('SERVICE_NOT_IN_BOOKING');
        }

        const normalizedServices = booking.services
            .filter((item) => {
                const currentId = item.service?._id ? item.service._id.toString() : item.service?.toString();
                return currentId !== serviceId.toString();
            })
            .map((item) => ({
                service: item.service?._id || item.service,
                quantity: item.quantity
            }));

        return await bookingsRepository.update(bookingId, { services: normalizedServices });
    }

    async deleteBooking(bookingId) {
        const deletedBooking = await bookingsRepository.delete(bookingId);
        if (!deletedBooking) {
            throw new Error('BOOKING_NOT_FOUND');
        }
        return deletedBooking;
    }
}