// backend/src/controllers/sim.controller.js
//import { simService } from "../services/sim.service.js";

export const simController = {
    getSim: async (request, reply) => {
        const { page, limit, sortBy, sortOrder, search, ...filter } = request.query;
        //const sim = await simService.getSim({ page, limit, sortBy, sortOrder, filter, search });
        return reply.view('sim.ejs');
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
