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
    createStore: async (request, reply) => {
        const store = await storeService.createStore(request.body);
        return reply.code(201).send(store);
    },
    updateStore: async (request, reply) => {
        const store = await storeService.updateStore(request.params.id, request.body);
        return store 
            ? reply.send(store) 
            : reply.code(404).send({ message: 'Store not found' });
    },
    deleteStore: async (request, reply) => {
        const store = await storeService.deleteStore(request.params.id);
        return store 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Store not found' });
    }
};