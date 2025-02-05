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
};