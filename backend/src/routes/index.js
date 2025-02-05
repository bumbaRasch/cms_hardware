// backend/src/routes/index.js
import {homeRouter} from './home.route.js';
import {hardwareRouter} from './hardware.route.js';
import {simRouter} from './sim.route.js';
import {userRouter} from './user.route.js';
import {providerRouter} from './provider.route.js';
import {tariffRouter} from './tariff.route.js';
import {locationRouter} from './location.route.js';
import {statusRouter} from './status.route.js';

async function routes(fastify, options) {
  fastify.register(homeRouter);
  fastify.register(hardwareRouter);
  fastify.register(simRouter);
  fastify.register(userRouter);
  fastify.register(providerRouter);
  fastify.register(tariffRouter);
  fastify.register(locationRouter);
  fastify.register(statusRouter);
}

export default routes;