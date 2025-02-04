// backend/src/routes/user.route.js
import { userController } from '../controllers/user.controller.js';

export const userRouter = async (fastify, options) => {
    fastify.get('/users', async (request, reply) => {
        return reply.view('users', { currentPath: '/users' });
    });

    fastify.get('/api/users/roles', userController.getRoles);

    fastify.get('/api/users', {
        schema: {
            querystring: {
                type: 'object',
                properties: {
                    offset: { type: 'integer', default: 0 },
                    limit: { type: 'integer', default: 10 },
                    sort: { type: 'string', default: 'CREATED_AT' },
                    order: { type: 'string', default: 'desc' },
                    search: { type: 'string' }
                }
            }
        }
    }, userController.getUsers);

    fastify.put('/api/users/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {
                    FIRST_NAME: { type: 'string' },
                    LAST_NAME: { type: 'string' },
                    USERNAME: { type: 'string' },
                    EMAIL: { type: 'string', format: 'email' },
                    PASSWORD: { type: 'string' }
                },
                required: ['FIRST_NAME', 'LAST_NAME', 'USERNAME', 'EMAIL']
            }
        }
    }, userController.updateUser);

    fastify.post('/api/users/:id/reset-password', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {
                    PASSWORD: {
                        type: 'string',
                        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'",.<>/?]).{8,}$'
                    }
                },
                required: ['PASSWORD']
            }
        }
    }, userController.resetPassword);

    fastify.delete('/api/users/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                },
                required: ['id']
            }
        }
    }, userController.deleteUser);
};