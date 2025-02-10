//backend/src/services/type.service.js
import prisma from '../configs/prisma.js';

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
                { HT_DESCRIPTION: { contains: search } },
                { tbl_hardware_categories: { HC_NAME: { contains: search } } },
            ];
        }

        const orderBy = [];
        if (sort === 'HC_NAME') {
            orderBy.push({ tbl_hardware_categories: { HC_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }    
        const types = await prisma.tbl_hardware_types.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_hardware_categories: { select: { HC_NAME: true } }
            },
        });

        const total = await prisma.tbl_hardware_types.count({
            where: whereClauses
        });

        return {
            data: types.map(item => ({
                HT_ID: item.HT_ID,
                HT_NAME: item.HT_NAME,
                HT_DESCRIPTION: item.HT_DESCRIPTION,
                HC_NAME: item.tbl_hardware_categories.HC_NAME,
            })),
            total: parseInt(total),
            offset: parseInt(offset),
            limit: parseInt(limit),
        }
    },
    createType: async (data) => {
        const type = await prisma.tbl_hardware_types.create({
            data: {
                HT_NAME: data.HT_NAME,
                HT_DESCRIPTION: data.HT_DESCRIPTION,
                HC_ID: parseInt(data.HC_NAME)
            },
            include: {
                tbl_hardware_categories: { select: { HC_NAME: true } }
            }
        });
        return {
            HT_ID: type.HT_ID,
            HT_NAME: type.HT_NAME,
            HT_DESCRIPTION: type.HT_DESCRIPTION,
            HC_NAME: type.tbl_hardware_categories.HC_NAME
        }
    },
    updateType: async (id ,data) => {
        console.log("data", data);
        const updateData = {
            HT_NAME: data.HT_NAME,
            HT_DESCRIPTION: data.HT_DESCRIPTION,
            HC_ID: parseInt(data.HC_NAME)
        };
        try {
            return await prisma.tbl_hardware_types.update({
                where: { HT_ID: parseInt(id) },
                data: updateData,
            });
        } catch (error) {
            console.error(error);
        }
    },
    deleteType: async (id) => {
        try{
            const type = await prisma.tbl_hardware_types.delete({
                where: { HT_ID: parseInt(id) }
            });
            return type;
        } catch (error) {         
            return null;
        }
    }
};
