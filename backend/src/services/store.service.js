// backend/src/services/store.service.js

import prisma from '../configs/prisma.js'

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
                { STORE_DESCRIPTION: { contains: search } },
                { tbl_locations: { LOC_NAME: { contains: search } } },
                { tbl_statuses: { ST_NAME: { contains: search } } },
            ];
        }

        const orderBy = [];
        if (sort === 'LOC_NAME') {
            orderBy.push({ tbl_locations: { LOC_NAME: order } });
        } else if (sort === 'ST_NAME') {
            orderBy.push({ tbl_statuses: { ST_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }

        const stores = await prisma.tbl_stores.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
            },
        });

        const total = await prisma.tbl_stores.count({
            where: whereClauses
        });
        return {
            data: stores.map(item => ({
                STORE_ID: item.STORE_ID,
                STORE_NAME: item.STORE_NAME,
                STORE_DESCRIPTION: item.STORE_DESCRIPTION,
                LOC_ID: item.LOC_ID,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                ST_ID: item.LOC_ID,
                ST_NAME: item.tbl_statuses.ST_NAME,
            })),
            total: parseInt(total),

        };
    },
};