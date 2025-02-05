// backend/src/routes/sim.route.js
import {simController} from '../controllers/sim.controller.js'

export const simRouter = async (fastify, options) => {
    fastify.get('/sim-cards', async (request, reply) => {
        return reply.view('sim', { currentPath: '/sim-cards' });
    });
    fastify.get('/api/sim-cards', simController.getSims);

    fastify.put('/api/sim-cards/:id', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    id: { 
                        type: 'integer'
                    }
                },
                required: ['id']
            },
            body: {
                type: 'object',
                properties: {        
                    SIM_NUMBER: { type: 'string' },
                    PROVIDER_ID: { type: 'string' },
                    TARIFF_ID: { type: 'string' },
                    LOC_ID: { type: 'string' },
                    STATUS_ID: { type: 'string' },
                    PIN1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PIN2: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK2: { type: 'string', pattern: '^[0-9]{4}$' },
                    ACTIVATION_DATE: { type: 'string' },
                    EXPIRATION_DATE: { type: 'string' },
                    COMMENTS: { type: 'string' },
                },
                required: ['SIM_NUMBER', 'PROVIDER_ID', 'TARIFF_ID', 'LOC_ID', 'STATUS_ID', 'PIN1', 'PUK1', 'PIN2', 'PUK2', 'ACTIVATION_DATE', 'EXPIRATION_DATE', 'COMMENTS']
            }
        }
    }, simController.updateSim);


    fastify.delete('/api/sim-cards/:id', simController.deleteSim);
}