import prisma from '../configs/database.js';
import { formatDate } from '../utils/date.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export const userService = {
    getUsers: async ({ offset = 0, limit = 10, sort = 'CREATED_AT', order = 'desc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }

        if (search) {
            whereClauses.OR = [
                { FIRST_NAME: { contains: search } },
                { LAST_NAME: { contains: search } },
                { USERNAME: { contains: search } },
                { EMAIL: { contains: search } }
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const users = await prisma.tbl_users.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_users.count({
            where: whereClauses
        });

        return {
            data: users.map(item => ({
                USER_ID: item.USER_ID,
                FIRST_NAME: item.FIRST_NAME,
                LAST_NAME: item.LAST_NAME,
                USERNAME: item.USERNAME,
                EMAIL: item.EMAIL,
                CREATED_AT: formatDate(item.CREATED_AT),
                UPDATED_AT: formatDate(item.UPDATED_AT),
                DELETED_AT: formatDate(item.DELETED_AT)
            })),
            total: parseInt(total),
            offset: parseInt(offset),
            limit: parseInt(limit),
        };
    },

    updateUser: async (id, data) => {
        const updateData = {
            FIRST_NAME: data.FIRST_NAME,
            LAST_NAME: data.LAST_NAME,
            USERNAME: data.USERNAME,
            EMAIL: data.EMAIL
        };

        if (data.PASSWORD) {
            const { salt, hash } = hashPassword(data.PASSWORD);
            updateData.PASSWORD = `${salt}:${hash}`;
        }

        return await prisma.tbl_users.update({
            where: { USER_ID: id },
            data: updateData
        });
    },
    
    deleteUser: async (id) => {
        return await prisma.tbl_users.delete({
            where: { USER_ID: id }
        });
    }
};