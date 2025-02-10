// backend/src/routes/index.js
import {homeRouter} from './home.route.js';
import {hardwareRouter} from './hardware.route.js';
import {simRouter} from './sim.route.js';
import {userRouter} from './user.route.js';
import {providerRouter} from './provider.route.js';
import {tariffRouter} from './tariff.route.js';
import { categoryRouter } from './category.route.js';
import {locationRouter} from './location.route.js';
import {statusRouter} from './status.route.js';
import {typeRouter} from './type.route.js';
import {currencyRouter} from './currency.route.js';
import {supplierRouter} from './supplier.route.js';
import {storeRouter} from './store.route.js';
import {botRouter} from './bot.route.js';


async function routes(fastify, options) {
  fastify.register(homeRouter);
  fastify.register(hardwareRouter);
  fastify.register(simRouter);
  fastify.register(userRouter);
  fastify.register(providerRouter);
  fastify.register(tariffRouter);
  fastify.register(categoryRouter);
  fastify.register(locationRouter);
  fastify.register(statusRouter);
  fastify.register(typeRouter);
  fastify.register(currencyRouter);
  fastify.register(supplierRouter);
  fastify.register(storeRouter);
  fastify.register(botRouter);
}

export default routes;