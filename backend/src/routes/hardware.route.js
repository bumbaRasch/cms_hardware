// backend/src/routes/hardware.route.js
import {hardwareController} from '../controllers/hardware.controller.js'


export const hardwareRouter = async (fastify, options) => {
    fastify.get('/hardware', async (request, reply) => {
        return reply.view('hardware', { currentPath: '/hardware' });
    });
    fastify.get('/api/hardware', hardwareController.getHardware);
    fastify.post('/hardware', hardwareController.createHardware);
    fastify.delete('/hardware/:id', hardwareController.deleteHardware);
};


