//backend/src/controllers/status.controller.js

import { statusService } from "../services/status.service.js";

export const statusController = {
    getStatuses: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const status = await statusService.getStatuses({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: status.total,
            totalNotFiltered: status.total,
            rows: status.data,    
        });
    },
    createStatus: async (request, reply) => {
        const status = await statusService.createStatus(request.body);
        return reply.code(201).send(status);
    },
    updateStatus: async (request, reply) => {
        const status = await statusService.updateStatus(request.params.id, request.body);
        return reply.send(status);
    },
    deleteStatus: async (request, reply) => {
        const status = await statusService.deleteStatus(request.params.id);
            return status 
                ? reply.code(204).send() 
                : reply.code(404).send({ message: 'Status not found' });
    },
};