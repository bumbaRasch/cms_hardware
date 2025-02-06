//backend/src/controllers/supplier.controller.js

import { supplierService } from '../services/supplier.service.js';

export const supplierController = {
    getSuppliers: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const suppliers = await supplierService.getSuppliers({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: suppliers.total,
            totalNotFiltered: suppliers.total,
            rows: suppliers.data,    
        });
    },
};