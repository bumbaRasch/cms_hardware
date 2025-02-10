// backend/src/routes/type.route.js
import { typeController } from '../controllers/type.controller.js';

export const typeRouter = async (fastify, options) => {
    fastify.get('/types', async (request, reply) => {
        return reply.view('types', { currentPath: '/types' });
    });
    fastify.get('/api/types', typeController.getTypes);
    fastify.post('/api/types', typeController.createType);
    fastify.put('/api/types/:id', typeController.updateType);
    //fastify.get('/api/types/:id', typeController.getType);
    fastify.delete('/api/types/:id', typeController.deleteType);
}