// backend/src/controllers/hardware.controller.js
import  prisma  from '../configs/database.js';

export const hardwareController = {
    getHardware: async (request, reply) => {
        const hardware = await prisma.tbl_hardware.findMany();
        return hardware;
    },
    createHardware: async (request, reply) => {
        return { hello: 'world' };
    }
};