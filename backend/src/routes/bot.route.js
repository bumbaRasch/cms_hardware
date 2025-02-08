//backend/src/routes/bot.route.js

import {botController} from '../controllers/bot.controller.js'

export const botRouter = async (fastify, options) => {
    fastify.get('/bot', async (request, reply) => {
        return reply.view('bot', { currentPath: '/bot' });
    });
    fastify.post('/api/ask', botController.handleAsk);
};