// backend/src/controllers/hardware.controller.js
import { hardwareService } from "../services/hardware.service.js";

export const hardwareController = {
    getHardware: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const hardware = await hardwareService.getHardware({ offset, limit, sort, order, filter, search });
        return reply.send({
            total: hardware.total,
            totalNotFiltered: hardware.total,
            rows: hardware.data
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