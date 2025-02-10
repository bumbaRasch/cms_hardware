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
                TARIFF_PRICE: parseFloat(data.TARIFF_PRICE),
                TARIFF_DESCRIPTION: data.TARIFF_DESCRIPTION,
                PROVIDER_ID: parseInt(data.PROVIDER_NAME),
                CURRENCY_ID: parseInt(data.CURRENCY_CODE),
            },
            include: {
                tbl_providers: { select: { PROVIDER_NAME: true } },
                tbl_currencies: { select: { CURRENCY_CODE: true } },
            }
        });
        return {
            TARIFF_ID: tariff.TARIFF_ID,
            TARIFF_NAME: tariff.TARIFF_NAME,
            TARIFF_PRICE: tariff.TARIFF_PRICE,
            TARIFF_DESCRIPTION: tariff.TARIFF_DESCRIPTION,
            PROVIDER_ID: tariff.PROVIDER_ID,
            PROVIDER_NAME: tariff.tbl_providers.PROVIDER_NAME,
            CURRENCY_ID: tariff.CURRENCY_ID,
            CURRENCY_CODE: tariff.tbl_currencies.CURRENCY_CODE,
        };
    },
    updateTariff: async (id, data) => {
        const updateData = {
            TARIFF_NAME: data.TARIFF_NAME,
            TARIFF_PRICE: parseFloat(data.TARIFF_PRICE),
            TARIFF_DESCRIPTION: data.TARIFF_DESCRIPTION,
            PROVIDER_ID: parseInt(data.PROVIDER_NAME),
            CURRENCY_ID: parseInt(data.CURRENCY_CODE),
        };
        try {
            return await prisma.tbl_tariffs.update({
                where: { TARIFF_ID: parseInt(id) },
                data: updateData
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    deleteTariff: async (id) => {
        try {
            const tariff = await prisma.tbl_tariffs.delete({
                where: { TARIFF_ID: parseInt(id) }
            });

            return tariff;
        } catch (error) {
            return null;
        }
    }
};