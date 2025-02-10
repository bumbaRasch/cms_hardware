// backend/src/routes/provider.route.js
import { providerController } from '../controllers/provider.controller.js';

export const providerRouter = async (fastify, options) => {
    fastify.get('/providers', async (request, reply) => {
        return reply.view('providers', { currentPath: '/providers' });
    });
    fastify.get('/api/providers', providerController.getProviders);
    fastify.post('/api/providers', providerController.createProvider);
    fastify.put('/api/providers/:id', providerController.updateProvider);
    //fastify.get('/api/providers/:id', providerController.getProvider);
    fastify.delete('/api/providers/:id', providerController.deleteProvider);

}