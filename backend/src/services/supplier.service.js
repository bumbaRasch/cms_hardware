//backend/src/services/supplier.service.js

import prisma from "../configs/prisma.js";

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
                { SUPPLIER_DESCRIPTION: { contains: search } },
                { tbl_locations: { LOC_NAME: { contains: search } } },
                { tbl_statuses: { ST_NAME: { contains: search } } },
            ];
        }

        const orderBy = [];
        if(sort === 'LOC_NAME') {
            orderBy.push({ tbl_locations: { LOC_NAME: order } });
        } else if(sort === 'ST_NAME') {
            orderBy.push({ tbl_statuses: { ST_NAME: order } });
        } else {
            orderBy.push({ [sort]: order });
        }
        
        const suppliers = await prisma.tbl_suppliers.findMany({
            where: whereClauses,
            orderBy,
            skip: parseInt(offset),
            take: parseInt(limit),
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
            }
        });

        const total = await prisma.tbl_suppliers.count({
            where: whereClauses
        });
        return {
            data: suppliers.map(item => ({
                SUPPLIER_ID: item.SUPPLIER_ID,
                SUPPLIER_NAME: item.SUPPLIER_NAME,
                SUPPLIER_DESCRIPTION: item.SUPPLIER_DESCRIPTION,
                LOC_ID: item.LOC_ID,
                LOC_NAME: item.tbl_locations.LOC_NAME,
                ST_ID: item.ST_ID,
                ST_NAME: item.tbl_statuses.ST_NAME,
            })),
            total: parseInt(total),

        };
    },
    createSupplier: async (data) => {
        const supplier = await prisma.tbl_suppliers.create({
            data: {
                SUPPLIER_NAME: data.SUPPLIER_NAME,
                SUPPLIER_DESCRIPTION: data.SUPPLIER_DESCRIPTION,
                LOC_ID: parseInt(data.LOC_NAME),
                ST_ID: parseInt(data.ST_NAME),
            },
            include: {
                tbl_locations: { select: { LOC_NAME: true } },
                tbl_statuses: { select: { ST_NAME: true } },
            }
        });
        return {
            SUPPLIER_ID: supplier.SUPPLIER_ID,
            SUPPLIER_NAME: supplier.SUPPLIER_NAME,
            SUPPLIER_DESCRIPTION: supplier.SUPPLIER_DESCRIPTION,
            LOC_ID: supplier.LOC_ID,
            LOC_NAME: supplier.tbl_locations.LOC_NAME,
            ST_ID: supplier.ST_ID,
            ST_NAME: supplier.tbl_statuses.ST_NAME,
        }
    },
    updateSupplier: async (id, supplier) => {
        const updateData = {
            SUPPLIER_NAME: supplier.SUPPLIER_NAME,
            SUPPLIER_DESCRIPTION: supplier.SUPPLIER_DESCRIPTION,
            LOC_ID: parseInt(supplier.LOC_NAME),
            ST_ID: parseInt(supplier.ST_NAME),
        };
        try {
            return await prisma.tbl_suppliers.update({
                where: { SUPPLIER_ID: parseInt(id) },
                data: updateData,
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    deleteSupplier: async (id) => {
        try {
            return await prisma.tbl_suppliers.delete({
                where: { SUPPLIER_ID: parseInt(id) },
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};