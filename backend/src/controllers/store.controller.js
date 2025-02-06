//backend/src/controllers/store.controller.js

import {storeService} from '../services/store.service.js'

export const storeController = {
    getStores: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const stores = await storeService.getStores({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: stores.total,
            totalNotFiltered: stores.total,
            rows: stores.data,    
        });
    },
};