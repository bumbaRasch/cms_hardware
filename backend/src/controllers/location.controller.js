//backend/src/controllers/location.controller.js

import { locationService } from "../services/location.service.js";

export const locationController = {
    getLocations: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const locations = await locationService.getLocations({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: locations.total,
            totalNotFiltered: locations.total,
            rows: locations.data,    
        });
    },
    createLocation: async (request, reply) => {
        const location = await locationService.createLocation(request.body);
        return location;
    },

    updateLocation: async (request, reply) => {
        const location = await locationService.updateLocation(request.params.id, request.body);
        return location 
            ? reply.send(location) 
            : reply.code(404).send({ message: 'Location not found' });
    },

    deleteLocation: async (request, reply) => {
        const location = await locationService.deleteLocation(request.params.id);
        return location 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Location not found' });
    }
};