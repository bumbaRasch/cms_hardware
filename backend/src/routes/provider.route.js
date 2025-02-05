// backend/src/routes/provider.route.js
import { providerController } from '../controllers/provider.controller.js';

export const providerRouter = async (fastify, options) => {
    fastify.get('/providers', async (request, reply) => {
        return reply.view('provider', { currentPath: '/providers' });
    });
    fastify.get('/api/providers', providerController.getProviders);
}