// backend/src/controllers/hardware.controller.js
import { hardwareService } from "../services/hardware.service.js";

export const hardwareController = {
    getHardware: async (request, reply) => {
        const { page, limit, sortBy, sortOrder, search, ...filter } = request.query;
        const hardware = await hardwareService.getHardware({ page, limit, sortBy, sortOrder, filter, search });
        return reply.view('hardware.ejs', { 
            data: hardware.data,
            total: hardware.total,
            page: hardware.page,
            limit: hardware.limit,
        });
    },
    createHardware: async (request, reply) => {
        const hardware = await hardwareService.createHardware(request.body);
        return hardware;
    },

    deleteHardware: async (request, reply) => {
        const hardware = await hardwareService.deleteHardware(request.params.id);
        return hardware 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Hardware not found' });
    }
};