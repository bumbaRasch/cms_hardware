// backend/src/controllers/user.controller.js
import { userService } from "../services/user.service.js";

export const userController = {
    getUsers: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const users = await userService.getUsers({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: users.total,
            totalNotFiltered: users.total,
            rows: users.data,    
        });
    },
    
    updateUser: async (request, reply) => {
        const user = await userService.updateUser(request.params.id, request.body);
        return user 
            ? reply.send(user) 
            : reply.code(404).send({ message: 'User not found' });
    },

    deleteUser: async (request, reply) => {
        const user = await userService.deleteUser(request.params.id);
        return user 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'User not found' });
    }
};