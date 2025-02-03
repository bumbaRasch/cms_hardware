// backend/src/routes/hardware.route.js
import {hardwareController} from '../controllers/hardware.controller.js'


export const hardwareRouter = async (fastify, options) => {
    fastify.get('/hardware', async (request, reply) => {
        return reply.view('hardware', { currentPath: '/hardware' });
    });
    fastify.get('/api/hardware', hardwareController.getHardware);
    fastify.post('/api/hardware', hardwareController.createHardware);
    fastify.delete('/api/hardware/:id', hardwareController.deleteHardware);
};


