// backend/src/routes/sim.route.js
import {simController} from '../controllers/sim.controller.js'

export const simRouter = async (fastify, options) => {
    fastify.get('/sim-cards', async (request, reply) => {
        return reply.view('sim', { currentPath: '/sim-cards' });
    });
    fastify.get('/api/sim-cards', simController.getSims);
    fastify.delete('/sim-cards/:id', simController.deleteSim);
}