//backend/src/services/provider.service.js

import prisma from '../configs/prisma.js';
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
                { PROVIDER_CONTACT: { contains: search } },
                { PROVIDER_DESCRIPTION: { contains: search } },
                { PROVIDER_TYPE: { contains: search } },
                { tbl_locations: { LOC_NAME: { contains: search } } },
                { tbl_statuses: { ST_NAME: { contains: search } } },

            ];
        }

        const orderBy = [];
        if(sort === 'LOC_NAME') {
            orderBy.push({ tbl_locations: { LOC_NAME: order } });
        } else if(sort === 'ST_NAME') {
            orderBy.push({ tbl_statuses: { ST_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }

        const providers = await prisma.tbl_providers.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
            },
        });

        const total = await prisma.tbl_providers.count({
            where: whereClauses
        });

        return {
            data: providers.map(item => ({
                PROVIDER_ID: item.PROVIDER_ID,
                PROVIDER_NAME: item.PROVIDER_NAME,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                ST_NAME: item.tbl_statuses.ST_NAME,
            })),
            total: parseInt(total),
        };
    },
};