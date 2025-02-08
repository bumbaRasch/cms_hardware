//backend/src/services/sim.service.js
import prisma from '../configs/prisma.js';
import { formatDate } from '../utils/date.js';

export const simService = {
    getSims: async ({ offset = 0, limit = 10, sort = 'SIM_CREATED_AT', order = 'desc', filter = {}, search = '' }) => {
        const whereClauses = {
            SIM_DELETED_AT: null
        };
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
                { COMMENTS: { contains: search } }
            ];
        }

        const orderBy = [];
        if (sort === 'PROVIDER_NAME') {
            orderBy.push({ tbl_providers: { PROVIDER_NAME: order } });
        } else if (sort === 'TARIFF_NAME') {
            orderBy.push({ tbl_tariffs: { TARIFF_NAME: order } });
        } else if (sort === 'LOC_NAME') {
            orderBy.push({ tbl_locations: { LOC_NAME: order } });
        } else if (sort === 'ST_NAME') {
            orderBy.push({ tbl_statuses: { ST_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }

        const sims = await prisma.tbl_sim_cards.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_tariffs: { select: { TARIFF_NAME: true } },
                tbl_providers: { select: { PROVIDER_NAME: true } }
            },
        });

        const total = await prisma.tbl_sim_cards.count({
            where: whereClauses
        });

        return {
            data: sims.map(item => ({
                SIM_ID: item.SIM_ID,
                SIM_NUMBER: item.SIM_NUMBER,
                PROVIDER_ID: item.PROVIDER_ID,
                PROVIDER_NAME: item.tbl_providers.PROVIDER_NAME,
                TARIFF_ID: item.TARIFF_ID,
                TARIFF_NAME: item.tbl_tariffs.TARIFF_NAME,
                LOC_ID: item.LOC_ID,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                STATUS_ID: item.STATUS_ID,
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
            offset: parseInt(offset),
            limit: parseInt(limit),
        };
    },
    createSim: async (body) => {
        const sim = await prisma.tbl_sim_cards.create({
            data: {
                SIM_NUMBER: body.SIM_NUMBER,
                PROVIDER_ID: body.PROVIDER_ID,
                TARIFF_ID: body.TARIFF_ID,
                LOC_ID: body.LOC_ID,
                STATUS_ID: body.STATUS_ID,
                PIN1: body.PIN1,
                PUK1: body.PUK1,
                PIN2: body.PIN2,
                PUK2: body.PUK2,
                ACTIVATION_DATE: new Date(body.ACTIVATION_DATE).toISOString(),
                EXPIRATION_DATE: new Date(body.EXPIRATION_DATE).toISOString(),
                COMMENTS: body.COMMENTS
            },
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
                tbl_tariffs: { select: { TARIFF_NAME: true } },
                tbl_providers: { select: { PROVIDER_NAME: true } }
            }
        });

        return {
            SIM_ID: sim.SIM_ID,
            SIM_NUMBER: sim.SIM_NUMBER,
            PROVIDER_NAME: sim.tbl_providers.PROVIDER_NAME,
            TARIFF_NAME: sim.tbl_tariffs.TARIFF_NAME,
            LOC_NAME: sim.tbl_locations.LOC_NAME,
            ST_NAME: sim.tbl_statuses.ST_NAME,
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

    updateSim: async (id, body) => {
        const updateData = {
            SIM_NUMBER: body.SIM_NUMBER,
            PROVIDER_ID: parseInt(body.PROVIDER_ID),
            TARIFF_ID: parseInt(body.TARIFF_ID),
            LOC_ID: parseInt(body.LOC_ID),
            STATUS_ID: parseInt(body.STATUS_ID),
            PIN1: body.PIN1,
            PUK1: body.PUK1,
            PIN2: body.PIN2,
            PUK2: body.PUK2,
            ACTIVATION_DATE: isValidDate(body.ACTIVATION_DATE) ? new Date(body.ACTIVATION_DATE).toISOString() : null,
            EXPIRATION_DATE: isValidDate(body.EXPIRATION_DATE) ? new Date(body.EXPIRATION_DATE).toISOString() : null,
            COMMENTS: body.COMMENTS
        };

        return await prisma.tbl_sim_cards.update({
            where: {
                SIM_ID: parseInt(id)
            },
            data: updateData,
        });
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

const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};