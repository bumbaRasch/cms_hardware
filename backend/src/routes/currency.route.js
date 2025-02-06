//backend/src/routes/currency.route.js

import {currencyController} from '../controllers/currency.controller.js'

export const currencyRouter = async (fastify, options) => {
    fastify.get('/currencies', async (request, reply) => {
        return reply.view('currencies', { currentPath: '/currencies' });
    });
    fastify.get('/api/currencies', currencyController.getCurrencies);
    // fastify.post('/api/currencies', currencyController.createCurrency);
    // fastify.delete('/api/currencies/:id', currencyController.deleteCurrency);
};