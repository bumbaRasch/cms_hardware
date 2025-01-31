// backend/src/routes/index.js
import {hardwareRouter} from './hardware.route.js';

async function routes(fastify, options) {
  fastify.register(hardwareRouter);
}

export default routes;