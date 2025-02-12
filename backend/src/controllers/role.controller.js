//backend/src/controllers/role.controller.js

import { roleService } from "../services/role.service.js";

export const roleController = {
    getRoles: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const role = await roleService.getRoles({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: role.total,
            totalNotFiltered: role.total,
            rows: role.data,    
        });
    },
    createRole: async (request, reply) => {
        const role = await roleService.createRole(request.body);
        return role;
    },

    updateRole: async (request, reply) => {
        const role = await roleService.updateRole(request.params.id, request.body);
        return role 
            ? reply.send(role) 
            : reply.code(404).send({ message: 'Role not found' });
    },

    deleteRole: async (request, reply) => {
        const role = await roleService.deleteRole(request.params.id);
        return role 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Role not found' });
    }
};