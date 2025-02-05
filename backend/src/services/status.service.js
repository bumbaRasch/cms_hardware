//backend/src/services/status.service.js

import prisma from '../configs/database.js'

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
            })),
            total: parseInt(total),

        };
    },
    createStatus: async (data) => {
        const status = await prisma.tbl_statuses.create({
            data: {
                ST_NAME: data.ST_NAME,
            }
        });

        return status;
    },
    updateStatus: async (id, data) => {
        const status = await prisma.tbl_statuses.update({
            where: { STATUS_ID: parseInt(id) },
            data: {
                ST_NAME: data.ST_NAME,
            }
        });

        return status;
    },
    deleteStatus: async (id) => {
        const status = await prisma.tbl_statuses.delete({
            where: { STATUS_ID: parseInt(id) },
        });

        return status;
    },
};