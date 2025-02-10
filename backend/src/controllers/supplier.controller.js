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
    createSupplier: async (request, reply) => {
        const supplier = await supplierService.createSupplier(request.body);
        return reply.code(201).send(supplier);
    },
    updateSupplier: async (request, reply) => {
        const supplier = await supplierService.updateSupplier(request.params.id, request.body);
        return supplier 
            ? reply.send(supplier) 
            : reply.code(404).send({ message: 'Supplier not found' });
    },
    deleteSupplier: async (request, reply) => {
        const supplier = await supplierService.deleteSupplier(request.params.id);
        return supplier 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Supplier not found' });
    }
};