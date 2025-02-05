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
};