//backend/src/services/status.service.js

import prisma from '../configs/prisma.js'

export const statusService = {
    getStatuses: async ({ offset = 0, limit = 10, sort = 'ST_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { ST_NAME: { contains: search } },
                { ST_DESCRIPTION: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const status = await prisma.tbl_statuses.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_statuses.count({
            where: whereClauses
        });

        return {
            data: status.map(item => ({
                ST_ID: item.ST_ID,
                ST_NAME: item.ST_NAME,
                ST_DESCRIPTION: item.ST_DESCRIPTION,
            })),
            total: parseInt(total),

        };
    },
    createStatus: async (data) => {
        const status = await prisma.tbl_statuses.create({
            data: {
                ST_NAME: data.ST_NAME,
                ST_DESCRIPTION: data.ST_DESCRIPTION,
            }
        });

        return status;
    },
    updateStatus: async (id, data) => {
        const updateData = {
            ST_NAME: data.ST_NAME,
            ST_DESCRIPTION: data.ST_DESCRIPTION,
        };

        try {
            return await prisma.tbl_statuses.update({
                where: { ST_ID: parseInt(id) },
                data: updateData,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    deleteStatus: async (id) => {
        try {
            return await prisma.tbl_statuses.delete({
                where: { ST_ID: parseInt(id) },
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};