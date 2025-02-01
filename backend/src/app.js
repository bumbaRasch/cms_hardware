import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import routes from './routes/index.js';
import fastifyCors from '@fastify/cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

fastify.register(fastifyView, {
  engine: {
    ejs: ejs
  },
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs'
});

fastify.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastify.register(routes);

fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
  if (err) throw err;
  fastify.log.info(`Server listening on ${address}`);
});