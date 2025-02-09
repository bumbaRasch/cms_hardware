import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import routes from './routes/index.js';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyHelmet from '@fastify/helmet';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';

const logger = {
    level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
    transport: isProd ? undefined : {
        target: 'pino-pretty',
        options: { colorize: true }
    }
};

const fastify = Fastify({ logger });

const registerPlugins = () => {
    fastify.register(fastifyView, {
        engine: { ejs },
        root: path.join(__dirname, 'views'),
        viewExt: 'ejs'
    });

    fastify.register(fastifyCors, {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    });

    fastify.register(fastifyStatic, {
        root: path.join(__dirname, '../public'),
        prefix: '/public/',
        decorateReply: false
    });

    fastify.register(fastifyHelmet, {
        contentSecurityPolicy: {
            directives: {
                    scriptSrc: ["'self'", "https://cdn.jsdelivr.net", ],
                }
            }
    });

    fastify.register(routes);
};

const startServer = async () => {
    try {
        await fastify.listen({ host: process.env.HOST || '0.0.0.0', port: process.env.PORT || 3000 });
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

const gracefulShutdown = () => {
    fastify.close().then(() => {
        console.log('Server closed gracefully');
        process.exit(0);
    }).catch((err) => {
        console.error('Error during server shutdown:', err);
        process.exit(1);
    });
};

process.on('SIGINT', gracefulShutdown); // Ctrl + C
process.on('SIGTERM', gracefulShutdown); // Termination signal from PM2, Kubernetes, etc.

const init = () => {
    registerPlugins();
    startServer();
};

init();