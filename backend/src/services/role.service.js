//backend/src/services/role.service.js

import prisma from '../configs/prisma.js';
import { formatDate } from '../utils/date.js';

export const roleService = {
    getRoles: async ({ offset = 0, limit = 10, sort = 'ROLE_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { ROLE_NAME: { contains: search } },
                { ROLE_DESCRIPTION: { contains: search } }
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const roles = await prisma.tbl_roles.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit)
        });

        const total = await prisma.tbl_roles.count({
            where: whereClauses
        });

        return {
            data: roles.map(item => ({
                ROLE_ID: item.ROLE_ID,
                ROLE_NAME: item.ROLE_NAME,
                ROLE_DESCRIPTION: item.ROLE_DESCRIPTION,
                CREATED_AT: formatDate(item.CREATED_AT),
                UPDATED_AT: formatDate(item.UPDATED_AT),
            })),
        }
    },
};