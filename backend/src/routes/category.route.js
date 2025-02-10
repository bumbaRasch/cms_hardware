// backend/src/routes/category.route.js

import { categoryController } from '../controllers/category.controller.js';

export const categoryRouter = async (fastify, options) => {
    fastify.get('/categories', async (request, reply) => {
        return reply.view('category', { currentPath: '/categories' });
    });
    fastify.get('/api/categories', categoryController.getCategories);
    // fastify.post('/api/categories', categoryController.createCategory);
    // fastify.put('/api/categories/:id', categoryController.updateCategory);
    // fastify.delete('/api/categories/:id', categoryController.deleteCategory);
}