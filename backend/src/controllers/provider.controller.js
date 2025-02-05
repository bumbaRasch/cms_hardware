//backend/src/controllers/provider.controller.js
import { providerService } from "../services/provider.service.js";

export const providerController = {
    getProviders: async (request, reply) => {
        const { offset, limit, sort, order, search, ...filter } = request.query;
        const providers = await providerService.getProviders({ offset, limit, sort, order, filter, search });
        return reply.send({ 
            total: providers.total,
            totalNotFiltered: providers.total,
            rows: providers.data,    
        });
    },
    createProvider: async (request, reply) => {
        const provider = await providerService.createProvider(request.body);
        return provider;
    },

    updateProvider: async (request, reply) => {
        const provider = await providerService.updateProvider(request.params.id, request.body);
        return provider 
            ? reply.send(provider) 
            : reply.code(404).send({ message: 'Provider not found' });
    },

    deleteProvider: async (request, reply) => {
        const provider = await providerService.deleteProvider(request.params.id);
        return provider 
            ? reply.code(204).send() 
            : reply.code(404).send({ message: 'Provider not found' });
    }
};