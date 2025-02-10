//backend/src/controllers/type.controller.js
import { typeService }  from "../services/type.service.js";

export const typeController = {
    getTypes: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const types = await typeService.getTypes({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: types.total,
            totalNotFiltered: types.total,
            rows: types.data,    
        });
    },
    createType: async (request, reply) => {
        const type = await typeService.createType(request.body);
        return reply.code(201).send(type);
    },
    updateType: async (request, reply) => {
        const type = await typeService.updateType(request.params.id, request.body);
        return type 
            ? reply.code(200).send(type) 
            : reply.code(404).send({ message: 'Type not found' });
    },
    deleteType: async (request, reply) => {
        const type = await typeService.deleteType(request.params.id);
        return type 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Type not found' });
    }
};