//backend/src/controllers/bot.controller.js

import { botService } from '../services/bot.service.js';

export const botController = {
    handleAsk: async (request, reply) => {
        const { question } = request.body;
        try {
            const result = await botService.handleAsk(question);
            return result 
                ? reply.send(result) 
                : reply.code(400).send({ message: 'Sorry' });
            
        } catch (error) {
            reply.status(error.status || 500).send({ error: error.message });
        }
    }
};