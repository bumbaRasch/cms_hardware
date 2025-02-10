// backend/src/routes/status.route.js

import { statusController } from '../controllers/status.controller.js';

export async function statusRouter(fastify, options) {
    fastify.get('/statuses', async (request, reply) => {
        return reply.view('statuses', { currentPath: '/statuses' });
    });
    fastify.get('/api/statuses', statusController.getStatuses);
    fastify.post('/api/statuses', statusController.createStatus);
    fastify.put('/api/statuses/:id', statusController.updateStatus);
    //fastify.get('/api/statuses/:id', statusController.getStatus);
    fastify.delete('/api/statuses/:id', statusController.deleteStatus);
}