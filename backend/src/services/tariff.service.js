//backend/src/services/tariff.service.js
import prisma from '../configs/prisma.js';

export const tariffService = {
    getTariffs: async ({ offset = 0, limit = 10, sort = 'TARIFF_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { TARIFF_NAME: { contains: search } },
                { TARIFF_PRICE: { contains: search } },
                { TARIFF_DESCRIPTION: { contains: search } },
                { tbl_providers: { PROVIDER_NAME: { contains: search } } },
                { tbl_currencies: { CURRENCY_CODE: { contains: search } } },
            ];
        }

        const orderBy = [];
        if (sort === 'PROVIDER_NAME') {
            orderBy.push({ tbl_providers: { PROVIDER_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }

        const tariffs = await prisma.tbl_tariffs.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_providers: { select: { PROVIDER_NAME: true } },
                tbl_currencies: { select: { CURRENCY_CODE: true } },
            },
        });

        const total = await prisma.tbl_tariffs.count({
            where: whereClauses
        });

       return {
        data: tariffs.map(item => ({
            TARIFF_ID: item.TARIFF_ID,
            TARIFF_NAME: item.TARIFF_NAME,
            TARIFF_PRICE: item.TARIFF_PRICE,
            TARIFF_DESCRIPTION: item.TARIFF_DESCRIPTION,
            CURRENCY_ID: item.CURRENCY_ID,
            CURRENCY_CODE: item.tbl_currencies.CURRENCY_CODE,
            PROVIDER_ID: item.PROVIDER_ID,
            PROVIDER_NAME: item.tbl_providers.PROVIDER_NAME,
        })),
        total: parseInt(total),
        offset: parseInt(offset),
        limit: parseInt(limit),
       }
    },
    createTariff: async (data) => {
        const tariff = await prisma.tbl_tariffs.create({
            data: {
                TARIFF_NAME: data.TARIFF_NAME,
                TARIFF_DESC: data.TARIFF_DESC,
                COMMENTS: data.COMMENTS
            }
        });

        return tariff;
    },
    updateTariff: async (id, data) => {
        const tariff = await prisma.tbl_tariffs.update({
            where: { TARIFF_ID: parseInt(id) },
            data: {
                TARIFF_NAME: data.TARIFF_NAME,
                TARIFF_DESC: data.TARIFF_DESC,
                COMMENTS: data.COMMENTS
            }
        });

        return tariff;
    },
    deleteTariff: async (id) => {
        const tariff = await prisma.tbl_tariffs.delete({
            where: { TARIFF_ID: parseInt(id) }
        });

        return tariff;
    }
};