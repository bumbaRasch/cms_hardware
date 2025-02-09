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
    deleteType: async (request, reply) => {
        const result = await typeService.deleteType(request.params.id);
        return result 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Type not found' });
    }
};