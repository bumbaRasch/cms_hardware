//backend/src/services/location.service.js

import prisma from '../configs/database.js';

export const locationService = {
    getLocations: async ({ offset = 0, limit = 10, sort = 'LOC_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { LOC_NAME: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const locations = await prisma.tbl_locations.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_locations.count({
            where: whereClauses
        });

        return {
            data: locations.map(item => ({
                LOC_ID: item.LOC_ID,
                LOC_NAME: item.LOC_NAME,
            })),
            total: parseInt(total),

        };
    },
    createLocation: async (data) => {
        const location = await prisma.tbl_locations.create({
            data: {
                LOC_NAME: data.LOC_NAME,
            }
        });

        return location;
    },
    updateLocation: async (id, data) => {
        const location = await prisma.tbl_locations.update({
            where: { LOCATION_ID: parseInt(id) },
            data: {
                LOC_NAME: data.LOC_NAME,
            }
        });

        return location;
    },
    deleteLocation: async (id) => {
        const location = await prisma.tbl_locations.delete({
            where: { LOCATION_ID: parseInt(id) }
        });

        return location;
    }
};


