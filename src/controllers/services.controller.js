import ServicesService from '../services/services.service.js';

const servicesService = new ServicesService();

export const getServices = async (req, res) => {
    try {
       
        const { category, available, page = 1, limit = 10, sortBy, order } = req.query;
        
        // 2. Construimos el objeto de filtros para MongoDB
        const filter = {};
        if (category) filter.category = category;
        if (available !== undefined) filter.available = available === 'true'; 

        
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        if (sortBy) {
            
            options.sort = { [sortBy]: order === 'desc' ? -1 : 1 };
        }

       
        const services = await servicesService.getServices(filter, options);
        
        
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const id = req.params.sid;
        const service = await servicesService.getServiceById(id);
        
        if (!service) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

export const createService = async (req, res) => {
    try {
        const { name, description, duration, price, category, available } = req.body;
        
        if (!name || !description || duration === undefined || price === undefined || !category || available === undefined) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios. Se requiere: name, description, duration, price, category y available.'
            });
        }
        
        const createdService = await servicesService.createService(req.body);
        
        // --- SOCKET.IO ---
        const io = req.app.get('socketio');
        // Pedimos los servicios (con un límite alto para la vista) y extraemos .docs para no romper el frontend
        const paginatedServices = await servicesService.getServices({}, { limit: 100, page: 1 }); 
        io.emit('updateServices', paginatedServices.docs);
        // -----------------

        res.status(201).json(createdService);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el servicio' });
    }
};

export const updateService = async (req, res) => {
    try {
        const id = req.params.sid;
        const updatedService = await servicesService.updateService(id, req.body);
        
        if (!updatedService) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        
        // --- SOCKET.IO ---
        const io = req.app.get('socketio');
        const paginatedServices = await servicesService.getServices({}, { limit: 100, page: 1 }); 
        io.emit('updateServices', paginatedServices.docs);
        // -----------------
        
        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
};

export const deleteService = async (req, res) => {
    try {
        const id = req.params.sid;
        const deletedService = await servicesService.deleteService(id);
        
        if (!deletedService) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        
        // --- SOCKET.IO ---
        const io = req.app.get('socketio');
        const paginatedServices = await servicesService.getServices({}, { limit: 100, page: 1 }); 
        io.emit('updateServices', paginatedServices.docs);
        // -----------------
        
        res.status(200).json({ message: 'Servicio eliminado correctamente', service: deletedService });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
};