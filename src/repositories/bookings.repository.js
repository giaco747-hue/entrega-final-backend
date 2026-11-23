import BookingsDao from '../dao/bookings.dao.js';

const dao = new BookingsDao();

export default class BookingsRepository {
    async getBookings(query = {}) {
        return await dao.getBookings(query);
    }

    async create(bookingData) {
        return await dao.createBooking(bookingData);
    }

    async getById(id) {
        return await dao.getBookingById(id);
    }

    async update(id, updatedData) {
        return await dao.updateBooking(id, updatedData);
    }

    async delete(id) {
        return await dao.deleteBooking(id);
    }
}