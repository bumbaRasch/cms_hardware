//backend/src/controllers/category.controller.js

import { categoryService } from "../services/category.service.js";

export const categoryController = {
    getCategories: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const categories = await categoryService.getCategories({ offset, limit, sort, order, filter, search });
        return reply.send({
            total: categories.total,
            totalNotFiltered: categories.total,
            rows: categories.data
        });
    },
    createCategory: async (request, reply) => {
        const category = await categoryService.createCategory(request.body);
        return reply.send(category);
    },
    updateCategory: async (request, reply) => {
        const category = await categoryService.updateCategory(request.params.id, request.body);
        return reply.send(category);
    },
    deleteCategory: async (request, reply) => {
        const category = await categoryService.deleteCategory(request.params.id);
        return reply.send(category);
    },
};