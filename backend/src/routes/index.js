// backend/src/routes/index.js
import {hardwareRouter} from './hardware.route.js';
import {homeRouter} from './home.route.js';

async function routes(fastify, options) {
  fastify.register(homeRouter);
  fastify.register(hardwareRouter);
}

export default routes;