// backend/src/routes/status.route.js

import { statusController } from '../controllers/status.controller.js';

export async function statusRouter(fastify, options) {
    fastify.get('/statuses', async (request, reply) => {
        return reply.view('statuses', { currentPath: '/statuses' });
    });
    fastify.get('/api/statuses', statusController.getStatuses);
}