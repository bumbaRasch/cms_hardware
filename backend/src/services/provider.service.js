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
                PROVIDER_TYPE: item.PROVIDER_TYPE,
                PROVIDER_CONTACT: item.PROVIDER_CONTACT,
                PROVIDER_DESCRIPTION: item.PROVIDER_DESCRIPTION,
                LOC_ID: item.LOC_ID,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                ST_ID: item.ST_ID,
                ST_NAME: item.tbl_statuses.ST_NAME,
            })),
            total: parseInt(total),
        };
    },

    createProvider: async (data) => {
        const provider = await prisma.tbl_providers.create({
            data: {
                PROVIDER_NAME: data.PROVIDER_NAME,
                PROVIDER_CONTACT: data.PROVIDER_CONTACT,
                PROVIDER_DESCRIPTION: data.PROVIDER_DESCRIPTION,
                PROVIDER_TYPE: data.PROVIDER_TYPE,
                LOC_ID: parseInt(data.LOC_NAME),
                ST_ID: parseInt(data.ST_NAME),
            },
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
            }
        });

        return {
            PROVIDER_ID: provider.PROVIDER_ID,
            PROVIDER_NAME: provider.PROVIDER_NAME,
            PROVIDER_CONTACT: provider.PROVIDER_CONTACT,
            PROVIDER_DESCRIPTION: provider.PROVIDER_DESCRIPTION,
            PROVIDER_TYPE: provider.PROVIDER_TYPE,
            LOC_ID: provider.LOC_ID,
            LOC_NAME: provider.tbl_locations.LOC_NAME,
            ST_ID: provider.ST_ID,
            ST_NAME: provider.tbl_statuses.ST_NAME,
        };
    },
    updateProvider: async (id, provider) => {
        const updateData = {
            PROVIDER_NAME: provider.PROVIDER_NAME,
            PROVIDER_CONTACT: provider.PROVIDER_CONTACT,
            PROVIDER_DESCRIPTION: provider.PROVIDER_DESCRIPTION,
            PROVIDER_TYPE: provider.PROVIDER_TYPE,
            LOC_ID: parseInt(provider.LOC_NAME),
            ST_ID: parseInt(provider.ST_NAME),
        };
        try {
            return await prisma.tbl_providers.update({
                where: { PROVIDER_ID: parseInt(id) },
                data: updateData,
            });
        } catch (error) {
            return null;
        }
    },
    deleteProvider: async (id) => {
        try {
            const provider = await prisma.tbl_providers.delete({
                where: { PROVIDER_ID: parseInt(id) }
            });

            return provider;
        } catch (error) {
            return null;
        }
    }
};