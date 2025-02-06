//backend/src/services/currency.service.js
import prisma from '../configs/database.js';

export const currencyService = {
    getCurrencies: async ({ offset = 0, limit = 10, sort = 'CURRENCY_CODE', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }
        if (search) {
            whereClauses.OR = [
                { CURRENCY_CODE: { contains: search } },
                { CURRENCY_NAME: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const currencies = await prisma.tbl_currencies.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_currencies.count({
            where: whereClauses
        });
        return {
            data: currencies.map(item => ({
                CURRENCY_ID: item.CURRENCY_ID,
                CURRENCY_CODE: item.CURRENCY_CODE,
                CURRENCY_NAME: item.CURRENCY_NAME,
            })),
            total: parseInt(total),

        };
    },
};