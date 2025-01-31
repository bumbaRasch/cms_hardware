// backend/src/routes/hardware.route.js
import {hardwareController} from '../controllers/hardware.controller.js'


export const hardwareRouter = async (fastify, options) => {
    fastify.get('/hardware', hardwareController.getHardware);
    fastify.post('/hardware', hardwareController.createHardware);
    fastify.delete('/hardware/:id', hardwareController.deleteHardware);
};


