// backend/src/routes/supplier.route.js

import {supplierController} from '../controllers/supplier.controller.js'

export const supplierRouter = async (fastify, options) => {
    fastify.get('/suppliers', async (request, reply) => {
        return reply.view('suppliers', { currentPath: '/suppliers' });
    });
    fastify.get('/api/suppliers', supplierController.getSuppliers);
    // fastify.post('/api/suppliers', supplierController.createSupplier);
    // fastify.delete('/api/suppliers/:id', supplierController.deleteSupplier);
};