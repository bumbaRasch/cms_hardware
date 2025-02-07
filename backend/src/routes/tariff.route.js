// backend/src/routes/tariff.route.js
import { tariffController } from '../controllers/tariff.controller.js';

export const tariffRouter = async (fastify, options) => {
    fastify.get('/tariffs', async (request, reply) => {
        return reply.view('tariffs', { currentPath: '/tariffs' });
    });
    fastify.get('/api/tariffs', tariffController.getTariffs);
}