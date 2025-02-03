import prisma from '../configs/database.js';
import { formatDate } from '../utils/date.js';

export const simService = {
    getSims: async ({ page = 1, limit = 10, sort = 'SIM_CREATED_AT', order = 'desc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { SIM_NUMBER: { contains: search } },
                { PROVIDER_NAME: { contains: search } },
                { TARIFF_NAME: { contains: search } },
                { LOC_NAME: { contains: search } },
                { ST_NAME: { contains: search } },
                { COMMENTS: { contains: search } }
            ];
        }

        const sims = await prisma.tbl_sim_cards.findMany({
            where: whereClauses,
            orderBy: { 
                [sort]: order 
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_tariffs: { select: { TARIFF_NAME: true } },
                tbl_providers: { select: { PROVIDER_NAME: true } }
            },
        });

        console.log(sims);

        const total = await prisma.tbl_sim_cards.count({
            where: whereClauses
        });

        return {
            data: sims.map(item => ({
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
                ACTIVATION_DATE: formatDate(item.ACTIVATION_DATE),
                EXPIRATION_DATE: formatDate(item.EXPIRATION_DATE),
                COMMENTS: item.COMMENTS,
                SIM_CREATED_AT: formatDate(item.SIM_CREATED_AT),
                SIM_UPDATED_AT: formatDate(item.SIM_UPDATED_AT),
                SIM_DELETED_AT: formatDate(item.SIM_DELETED_AT)
            })),
            total: parseInt(total),
            page: parseInt(page),
            limit: parseInt(limit),
        };
    },
    createSim: async (body) => {
        const sim = await prisma.tbl_sim_cards.create({
            data: {
                SIM_NUMBER: body.SIM_NUMBER,
                PROVIDER_NAME: body.PROVIDER_NAME,
                TARIFF_NAME: body.TARIFF_NAME,
                LOC_NAME: body.LOC_NAME,
                ST_NAME: body.ST_NAME,
                PIN1: body.PIN1,
                PUK1: body.PUK1,
                PIN2: body.PIN2,
                PUK2: body.PUK2,
                ACTIVATION_DATE: new Date(body.ACTIVATION_DATE).toISOString(),
                EXPIRATION_DATE: new Date(body.EXPIRATION_DATE).toISOString(),
                COMMENTS: body.COMMENTS
            }
        });

        return {
            SIM_ID: sim.SIM_ID,
            SIM_NUMBER: sim.SIM_NUMBER,
            PROVIDER_NAME: sim.PROVIDER_NAME,
            TARIFF_NAME: sim.TARIFF_NAME,
            LOC_NAME: sim.LOC_NAME,
            ST_NAME: sim.ST_NAME,
            PIN1: sim.PIN1,
            PUK1: sim.PUK1,
            PIN2: sim.PIN2,
            PUK2: sim.PUK2,
            ACTIVATION_DATE: formatDate(sim.ACTIVATION_DATE),
            EXPIRATION_DATE: formatDate(sim.EXPIRATION_DATE),
            COMMENTS: sim.COMMENTS,
            SIM_CREATED_AT: formatDate(sim.SIM_CREATED_AT),
            SIM_UPDATED_AT: formatDate(sim.SIM_UPDATED_AT),
            SIM_DELETED_AT: formatDate(sim.SIM_DELETED_AT)
        };
    },

    deleteSim: async (id) => {
        try {
            await prisma.tbl_hardware.updateMany({
                where: {
                    HA_SIM_CARD: parseInt(id)
                },
                data: {
                    HA_SIM_CARD: null
                }
            });

            const sim = await prisma.tbl_sim_cards.delete({
                where: {
                    SIM_ID: parseInt(id)
                }
            });
            return sim;
        } 
        catch (error) {
            console.error(error);
            return null;
        }
    }
};