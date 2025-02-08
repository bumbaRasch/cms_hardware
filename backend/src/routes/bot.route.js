//backend/src/routes/bot.route.js

import {botController} from '../controllers/bot.controller.js'

export const botRouter = async (fastify, options) => {
    fastify.post('/api/ask', botController.handleAsk);
};