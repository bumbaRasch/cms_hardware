//backend/src/services/provider.service.js

import prisma from '../configs/database.js';
import { formatDate } from '../utils/date.js';

export const providerService = {
    getProviders : async ({ offset = 0, limit = 10, sort = 'PROVIDER_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { PROVIDER_NAME: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const providers = await prisma.tbl_providers.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_providers.count({
            where: whereClauses
        });

        return {
            data: providers.map(item => ({
                PROVIDER_ID: item.PROVIDER_ID,
                PROVIDER_NAME: item.PROVIDER_NAME,
            })),
            total: parseInt(total),
        };
    },
};