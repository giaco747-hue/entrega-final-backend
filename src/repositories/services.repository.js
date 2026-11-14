import ServicesDao from '../dao/services.dao.js';

const dao = new ServicesDao();

export default class ServicesRepository {
    async getAll(filter = {}, options = {}) {
        return await dao.getServices(filter, options);
    }

    async getById(id) {
        return await dao.getServiceById(id);
    }

    async create(serviceData) {
        return await dao.createService(serviceData);
    }

    async update(id, updatedData) {
        return await dao.updateService(id, updatedData);
    }

    async delete(id) {
        return await dao.deleteService(id);
    }
}