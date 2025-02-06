//backend/src/controllers/currency.controller.js

import { currencyService } from "../services/currency.service.js";

export const currencyController = {
    getCurrencies: async (request, reply) => {
            const { offset, limit, sort, order, search, ...filter } = request.query;
            const currencies = await currencyService.getCurrencies({ offset, limit, sort, order, filter, search });
            return reply.send({
                total: currencies.total,
                totalNotFiltered: currencies.total,
                rows: currencies.data
            });
        },
};