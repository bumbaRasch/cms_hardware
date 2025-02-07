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

const logger = {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
};

const fastify = Fastify({ logger });

fastify.register(fastifyView, {
    engine: {
        ejs: ejs
    },
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
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    }
});

fastify.register(routes);

const startServer = async () => {
    try {
        await fastify.listen({ host: process.env.HOST || '0.0.0.0', port: process.env.PORT || 3000 });
        const address = fastify.server.address();
        fastify.log.info(`Server listening on ${address.address}:${address.port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();