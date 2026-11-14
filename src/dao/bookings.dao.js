import { BookingModel } from '../models/booking.model.js';

export default class BookingsDAO {
    
    async getBookings(filter = {}) {
        
        return await BookingModel.find(filter).populate('services.service');
    }

    async getBookingById(id) {
        
        return await BookingModel.findById(id).populate('services.service');
    }

    async createBooking(bookingData) {
        return await BookingModel.create(bookingData);
    }

    async addServiceToBooking(bookingId, serviceId) {
        const booking = await BookingModel.findById(bookingId);
        if (!booking) throw new Error('BOOKING_NOT_FOUND');

        // Agregamos la referencia del servicio como lo exige el nuevo modelo
        booking.services.push({ service: serviceId, quantity: 1 });
        return await booking.save();
    }

    async updateBooking(id, bookingData) {
        return await BookingModel.findByIdAndUpdate(id, bookingData, { new: true });
    }

    async deleteBooking(id) {
        return await BookingModel.findByIdAndDelete(id);
    }
}