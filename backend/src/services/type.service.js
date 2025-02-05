//backend/src/services/type.service.js
import prisma from '../configs/database.js';

export const typeService = {
    getTypes: async ({ offset = 0, limit = 10, sort = 'HT_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { HT_NAME: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const types = await prisma.tbl_hardware_types.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_hardware_types.count({
            where: whereClauses
        });

        return {
            data: types.map(item => ({
                HT_ID: item.HT_ID,
                HT_NAME: item.HT_NAME,
            })),
            total: parseInt(total),
            offset: parseInt(offset),
            limit: parseInt(limit),
        }
    },
    createType: async (data) => {
        const type = await prisma.tbl_hardware_types.create({
            data: {
                TYPE_NAME: data.TYPE_NAME,
                COMMENTS: data.COMMENTS
            }
        });
        return type;
    },
    updateType: async (data) => {
        const type = await prisma.tbl_hardware_types.update({
            where: { TYPE_ID: data.TYPE_ID },
            data: {
                TYPE_NAME: data.TYPE_NAME,
                COMMENTS: data.COMMENTS
            }
        });
        return type;
    },
    deleteType: async (data) => {
        const type = await prisma.tbl_hardware_types.delete({
            where: { TYPE_ID: data.TYPE_ID }
        });
        return type;
    }
};
