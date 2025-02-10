//backend/src/servies/category.service.js

import prisma from '../configs/prisma.js';

export const categoryService = {
    getCategories: async ({ offset = 0, limit = 10, sort = 'HC_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { HC_NAME: { contains: search } },
                { HC_DESCRIPTION: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const categories = await prisma.tbl_hardware_categories.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_hardware_categories.count({
            where: whereClauses
        });

        return {
            data: categories.map(item => ({
                HC_ID: item.HC_ID,
                HC_NAME: item.HC_NAME,
                HC_DESCRIPTION: item.HC_DESCRIPTION,
            })),
            total: parseInt(total),
        };
    },
    createCategory: async (data) => {
        const category = await prisma.tbl_hardware_categories.create({
            data: {
                HC_NAME: data.HC_NAME,
                HC_DESCRIPTION: data.HC_DESCRIPTION
            }
        });
        return category;
    },
    updateCategory: async (id, data) => {
        const category = await prisma.tbl_hardware_categories.update({
            where: { CAT_ID: parseInt(id) },
            data: {
                HC_NAME: data.HC_NAME,
                HC_DESCRIPTION: data.HC_DESCRIPTION
            }
        });
        return category;
    },
    deleteCategory: async (id) => {
        const category = await prisma.tbl_hardware_categories.delete({
            where: { HC_ID: parseInt(id) }
        });
        return category;
    },
};