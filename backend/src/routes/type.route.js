// backend/src/routes/type.route.js
import { typeController } from '../controllers/type.controller.js';

export const typeRouter = async (fastify, options) => {
    fastify.get('/types', async (request, reply) => {
        return reply.view('types', { currentPath: '/types' });
    });
    fastify.get('/api/types', typeController.getTypes);
}