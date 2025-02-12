// backend/src/routes/role.route.js

import { roleController } from '../controllers/role.controller.js';

export const roleRouter = async (fastify, options) => {
    fastify.get('/roles', async (request, reply) => {
        return reply.view('role', { currentPath: '/roles' });
    });
    fastify.get('/api/roles', roleController.getRoles);
    // fastify.post('/api/roles', roleController.createRole);
    // fastify.put('/api/roles/:id', roleController.updateRole);
    // fastify.delete('/api/roles/:id', roleController.deleteRole);
}