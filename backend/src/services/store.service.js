// backend/src/services/store.service.js

import prisma from '../configs/database.js'

export const storeService = {
    getStores: async ({ offset = 0, limit = 10, sort = 'STORE_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }
        if (search) {
            whereClauses.OR = [
                { STORE_NAME: { contains: search } },
                { STORE_LOCATION: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const stores = await prisma.tbl_stores.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_stores.count({
            where: whereClauses
        });
        return {
            data: stores.map(item => ({
                STORE_ID: item.STORE_ID,
                STORE_NAME: item.STORE_NAME,
                STORE_LOCATION: item.STORE_LOCATION,
            })),
            total: parseInt(total),

        };
    },
};