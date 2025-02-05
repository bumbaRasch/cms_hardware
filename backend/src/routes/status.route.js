// backend/src/routes/status.route.js

import { statusController } from '../controllers/status.controller.js';

export async function statusRouter(fastify, options) {
    fastify.get('/api/statuses', statusController.getStatuses);
}