// backend/src/routes/index.js
import {homeRouter} from './home.route.js';
import {hardwareRouter} from './hardware.route.js';
import {simRouter} from './sim.route.js';
import {userRouter} from './user.route.js';

async function routes(fastify, options) {
  fastify.register(homeRouter);
  fastify.register(hardwareRouter);
  fastify.register(simRouter)
  fastify.register(userRouter);
}

export default routes;