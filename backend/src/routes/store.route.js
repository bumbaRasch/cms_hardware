// backend/src/routes/store.route.js

import {storeController} from '../controllers/store.controller.js'

export const storeRouter = async (fastify, options) => {
    fastify.get('/stores', async (request, reply) => {
        return reply.view('stores', { currentPath: '/stores' });
    });
    fastify.get('/api/stores', storeController.getStores);
    fastify.post('/api/stores', storeController.createStore);
    fastify.put('/api/stores/:id', storeController.updateStore);
    // fastify.get('/api/stores/:id', storeController.getStore);
    fastify.delete('/api/stores/:id', storeController.deleteStore);
}