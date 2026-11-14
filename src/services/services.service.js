import ServicesDAO from '../dao/services.dao.js';

export default class ServicesService {
    constructor() {
        this.servicesDao = new ServicesDAO();
    }

    // NUEVO MÉTODO: Recibe los filtros y opciones de paginación y los pasa al DAO
    async getServices(filter = {}, options = {}) {
        return await this.servicesDao.getServices(filter, options);
    }

    // MÉTODOS CLÁSICOS: Se mantienen intactos
    async getServiceById(id) {
        return await this.servicesDao.getServiceById(id);
    }

    async createService(serviceData) {
        return await this.servicesDao.createService(serviceData);
    }

    async updateService(id, serviceData) {
        return await this.servicesDao.updateService(id, serviceData);
    }

    async deleteService(id) {
        return await this.servicesDao.deleteService(id);
    }
}