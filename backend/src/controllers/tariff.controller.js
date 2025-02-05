//backend/src/controllers/tariff.controller.js
import { tariffService } from "../services/tariff.service.js";

export const tariffController = {
    getTariffs: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const tariffs = await tariffService.getTariffs({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: tariffs.total,
            totalNotFiltered: tariffs.total,
            rows: tariffs.data,    
        });
    },
    createTariff: async (request, reply) => {
        const tariff = await tariffService.createTariff(request.body);
        return tariff;
    },

    updateTariff: async (request, reply) => {
        const tariff = await tariffService.updateTariff(request.params.id, request.body);
        return tariff 
            ? reply.send(tariff) 
            : reply.code(404).send({ message: 'Tariff not found' });
    },

    deleteTariff: async (request, reply) => {
        const tariff = await tariffService.deleteTariff(request.params.id);
        return tariff 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Tariff not found' });
    }
};