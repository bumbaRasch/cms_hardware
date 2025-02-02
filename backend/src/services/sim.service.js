//backend/src/services/sim.service.js

import prisma from '../configs/database.js';

export const simService = {
    getSim: async ({ page = 1, limit = 10, sortBy = 'SIM_CREATED_AT', sortOrder = 'desc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }
        if (search) {
            whereClauses.OR = [
                { SIM_NUMBER: { contains: search } },
                { tbl_providers: { PROVIDER_NAME: { contains: search } } },
                { tbl_tariffs: { TARIFF_NAME: { contains: search } } },
                { tbl_locations: { LOC_NAME: { contains: search } } },
                { tbl_statuses: { ST_NAME: { contains: search } } },
                { PIN1: { contains: search } },
                { PUK1: { contains: search } },
                { PIN2: { contains: search } },
                { PUK2: { contains: search } },
                { COMMENTS: { contains: search } }
            ];
        }

        const simcards = await prisma.tbl_sim_cards.findMany({
            where: whereClauses,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                tbl_providers: true,
                tbl_tariffs: true,
                tbl_locations: true,
                tbl_statuses: true
            }
        });

        const total = await prisma.tbl_sim_cards.count({
            where: whereClauses
        });

        return { 
            data: 
                simcards.map(item => ({
                    SIM_ID: item.SIM_ID,
                    SIM_NUMBER: item.SIM_NUMBER,
                    PROVIDER_NAME: item.tbl_providers.PROVIDER_NAME,
                    TARIFF_NAME: item.tbl_tariffs.TARIFF_NAME,
                    LOC_NAME: item.tbl_locations.LOC_NAME,
                    ST_NAME: item.tbl_statuses.ST_NAME,
                    PIN1: item.PIN1,
                    PUK1: item.PUK1,
                    PIN2: item.PIN2,
                    PUK2: item.PUK2,
                    COMMENTS: item.COMMENTS,
                    ACTIVATION_DATE: item.ACTIVATION_DATE,
                    EXPIRATION_DATE: item.EXPIRATION_DATE,
                    SIM_CREATED_AT: item.SIM_CREATED_AT
                }))
            ,
            total,
            page: parseInt(page),
            limit: parseInt(limit)
        };
    },
    createSim: async (data) => {
        return await prisma.tbl_sim_cards.create({ data });
    },
    deleteSim: async (id) => {
        try {
            const simcards = await prisma.tbl_sim_cards.delete({ 
                where: { SIM_ID: parseInt(id) } 
            });
            return simcards;
        }

        catch (error) {
            console.error(error);
            return null;
        }
    }
};