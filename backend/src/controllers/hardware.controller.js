// backend/src/controllers/hardware.controller.js
import { hardwareService } from "../services/hardware.service.js";

export const hardwareController = {
    getHardware: async (request, reply) => {
        const { page, limit, sortBy, sortOrder, search, ...filter } = request.query;
        const hardware = await hardwareService.getHardware({ page, limit, sortBy, sortOrder, filter, search });
        return hardware;
    },
    createHardware: async (request, reply) => {
        return { hello: 'world' };
    }
};