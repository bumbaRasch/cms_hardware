// backend/src/controllers/sim.controller.js
import { simService } from "../services/sim.service.js";

export const simController = {
    getSims: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const sim = await simService.getSims({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: sim.total,
            totalNotFiltered: sim.total,
            rows: sim.data,    
        });
    },
    createSim: async (request, reply) => {
        const sim = await simService.createSim(request.body);
        return sim;
    },

    deleteSim: async (request, reply) => {
        const sim = await simService.deleteSim(request.params.id);
        return sim 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Sim not found' });
    }
};
