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
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
    console.error("Failed to load environment variables:", result.error);
    process.exit(1);
}

const isProd = process.env.NODE_ENV === 'production';

const logger = isProd
    ? { level: process.env.LOG_LEVEL || 'info' }
    : {
        level: process.env.LOG_LEVEL || 'debug',
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    };

const fastify = Fastify({ logger });

fastify.addHook('onRequest', (request, reply, done) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    reply.locals = { nonce };
    reply.header('Content-Security-Policy', `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net; style-src 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com; img-src 'self' data: https://cdn.jsdelivr.net; connect-src 'self' https://cdn.jsdelivr.net; object-src 'none'; upgrade-insecure-requests;`);
    done();
});

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
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

startServer();

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
;