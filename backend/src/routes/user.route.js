// backend/src/routes/user.route.js
import {userController} from '../controllers/user.controller.js'

export const userRouter = async (fastify, options) => {
    fastify.get('/users', async (request, reply) => {
        return reply.view('users', { currentPath: '/users' });
    });
    fastify.get('/api/users', userController.getUsers);
    fastify.put('/api/users/:id', userController.updateUser);
    fastify.delete('/api/users/:id', userController.deleteUser);
}