// backend/src/routes/sim.route.js
import {simController} from '../controllers/sim.controller.js'

export const simRouter = async (fastify, options) => {
    fastify.get('/sim', simController.getSim);
}