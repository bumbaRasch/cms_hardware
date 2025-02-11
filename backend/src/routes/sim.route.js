// backend/src/routes/sim.route.js
import {simController} from '../controllers/sim.controller.js'

export const simRouter = async (fastify, options) => {
    fastify.get('/sim-cards', async (request, reply) => {
        return reply.view('sim', { currentPath: '/sim-cards' });
    });
    fastify.get('/api/sim-cards', simController.getSims);

    //fastify.get('/api/sim-cards/:id', simController.getSimById);

    fastify.post('/api/sim-cards', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    SIM_NUMBER: { type: 'string' },
                    PROVIDER_NAME: { type: 'string' },
                    TARIFF_NAME: { type: 'string' },
                    LOC_NAME: { type: 'string' },
                    ST_NAME: { type: 'string' },
                    PIN1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PIN2: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK2: { type: 'string', pattern: '^[0-9]{4}$' },
                    ACTIVATION_DATE: { type: 'string' },
                    EXPIRATION_DATE: { type: 'string' },
                    COMMENTS: { type: 'string' },
                },
                required: ['SIM_NUMBER', 'PROVIDER_NAME', 'TARIFF_NAME', 'LOC_NAME', 'ST_NAME', 'PIN1', 'PUK1', 'PIN2', 'PUK2',]
            }
        },
    }, simController.createSim);
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
                    PROVIDER_NAME: { type: 'string' },
                    TARIFF_NAME: { type: 'string' },
                    LOC_NAME: { type: 'string' },
                    ST_NAME: { type: 'string' },
                    PIN1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK1: { type: 'string', pattern: '^[0-9]{4}$' },
                    PIN2: { type: 'string', pattern: '^[0-9]{4}$' },
                    PUK2: { type: 'string', pattern: '^[0-9]{4}$' },
                    ACTIVATION_DATE: { type: 'string' },
                    EXPIRATION_DATE: { type: 'string' },
                    COMMENTS: { type: 'string' },
                },
                required: ['SIM_NUMBER', 'PROVIDER_NAME', 'TARIFF_NAME', 'LOC_NAME', 'ST_NAME', 'PIN1', 'PUK1', 'PIN2', 'PUK2',]
            }
        }
    }, simController.updateSim);


    fastify.delete('/api/sim-cards/:id', simController.deleteSim);
}