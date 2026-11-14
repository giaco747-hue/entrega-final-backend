import { ServiceModel } from '../models/service.model.js';

export default class ServicesDAO {
    
    // NUEVO MÉTODO: Ahora usa paginate() y acepta filtros y opciones
    async getServices(filter = {}, options = {}) {
        return await ServiceModel.paginate(filter, options);
    }

    // MÉTODOS CLÁSICOS
    async getServiceById(id) {
        return await ServiceModel.findById(id);
    }

    async createService(serviceData) {
        return await ServiceModel.create(serviceData);
    }

    async updateService(id, serviceData) {
        return await ServiceModel.findByIdAndUpdate(id, serviceData, { new: true });
    }

    async deleteService(id) {
        return await ServiceModel.findByIdAndDelete(id);
    }
}