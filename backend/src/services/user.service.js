// backend/src/services/user.service.js
import prisma from '../configs/database.js';
import { formatDate } from '../utils/date.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export const userService = {
    getUsers: async ({ offset = 0, limit = 10, sort = 'CREATED_AT', order = 'desc', filter = {}, search = '' }) => {
        const whereClauses = {
            DELETED_AT: null
        };
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
        if (sort === 'ROLE_NAME') {
            orderBy.push({ tbl_roles:  { ROLE_NAME: order } } );

        } else {
            orderBy.push({ [sort]: order });
        }

        const users = await prisma.tbl_users.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_roles: { select: { ROLE_NAME: true }}
            }
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
                ROLE_NAME: item.tbl_roles ? item.tbl_roles.ROLE_NAME : null,
                ROLE_ID: item.ROLE_ID,
                CREATED_AT: formatDate(item.CREATED_AT),
                UPDATED_AT: formatDate(item.UPDATED_AT),
            })),
            total: parseInt(total),
            offset: parseInt(offset),
            limit: parseInt(limit),
        };
    },

    getUserById: async (id) => {
        const user = await prisma.tbl_users.findUnique({
            where: { USER_ID: id },
            select: {
                USER_ID: true,
                FIRST_NAME: true,
                LAST_NAME: true,
                USERNAME: true,
                EMAIL: true,
                ROLE_ID: true,
                CREATED_AT: true,
                UPDATED_AT: true,
                tbl_roles: { select: { ROLE_NAME: true } }
            }
        });

        return user ? {
            USER_ID: user.USER_ID,
            FIRST_NAME: user.FIRST_NAME,
            LAST_NAME: user.LAST_NAME,
            USERNAME: user.USERNAME,
            EMAIL: user.EMAIL,
            ROLE_ID: user.ROLE_ID,
            CREATED_AT: formatDate(user.CREATED_AT),
            UPDATED_AT: formatDate(user.UPDATED_AT),
            ROLE_NAME: user.tbl_roles ? user.tbl_roles.ROLE_NAME : null
        } : null;
    },

    getRoles: async () => {
        return await prisma.tbl_roles.findMany({
            select: {
                ROLE_ID: true,
                ROLE_NAME: true
            }
        });
    },

    updateUser: async (id, data) => {
        const updateData = {
            FIRST_NAME: data.FIRST_NAME,
            LAST_NAME: data.LAST_NAME,
            USERNAME: data.USERNAME,
            EMAIL: data.EMAIL,
            ROLE_ID: parseInt(data.ROLE_ID)
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
        return await prisma.tbl_users.update({
            where: { USER_ID: id },
            data: { 
                DELETED_AT: new Date()
            }
        });
    },

    resetPassword: async (id, data) => {
        const { salt, hash } = hashPassword(data.PASSWORD);
        return await prisma.tbl_users.update({
            where: { USER_ID: id },
            data: { PASSWORD: `${salt}:${hash}` }
        });
    }
};