//backend/src/services/supplier.service.js

import prisma from "../configs/database.js";

export const supplierService = {
    getSuppliers: async ({ offset = 0, limit = 10, sort = 'SUPPLIER_NAME', order = 'asc', filter = {}, search = '' }) => {
        const whereClauses = {};
        for (const [key, value] of Object.entries(filter)) {
            if (value) {
                whereClauses[key] = { contains: value };
            }
        }
        if (search) {
            whereClauses.OR = [
                { SUPPLIER_NAME: { contains: search } },
                { SUPPLIER_CONTACT: { contains: search } },
            ];
        }

        const orderBy = [];
        orderBy.push({ [sort]: order });

        const suppliers = await prisma.tbl_suppliers.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
        });

        const total = await prisma.tbl_suppliers.count({
            where: whereClauses
        });
        return {
            data: suppliers.map(item => ({
                SUPPLIER_ID: item.SUPPLIER_ID,
                SUPPLIER_NAME: item.SUPPLIER_NAME,
                SUPPLIER_CONTACT: item.SUPPLIER_CONTACT,
            })),
            total: parseInt(total),

        };
    },
    createSupplier: async (supplier) => {
        const newSupplier = await prisma.tbl_suppliers.create({
            data: {
                SUPPLIER_ID: supplier.SUPPLIER_ID,
                SUPPLIER_NAME: supplier.SUPPLIER_NAME,
                SUPPLIER_CONTACT: supplier.SUPPLIER_CONTACT,
            }
        });
        return newSupplier;
    },
    updateSupplier: async (id, supplier) => {
        const updatedSupplier = await prisma.tbl_suppliers.update({
            where: { SUPPLIER_ID: parseInt(id) },
            data: {
                SUPPLIER_NAME: supplier.SUPPLIER_NAME,
                SUPPLIER_CONTACT: supplier.SUPPLIER_CONTACT,
            }
        });
        return updatedSupplier;
    }
};