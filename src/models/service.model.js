import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const serviceCollection = 'services';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true }
});

// Plug-in de paginación
serviceSchema.plugin(mongoosePaginate);

export const ServiceModel = mongoose.model(serviceCollection, serviceSchema);