import mongoose from 'mongoose';

const bookingCollection = 'bookings';

const bookingSchema = new mongoose.Schema({
    // Datos de la reserva 
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: 'pending' },
    
   
    services: [
        {
            service: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'services' 
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
});

export const BookingModel = mongoose.model(bookingCollection, bookingSchema);