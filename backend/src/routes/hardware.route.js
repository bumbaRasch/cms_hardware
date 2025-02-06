// backend/src/routes/hardware.route.js
import {hardwareController} from '../controllers/hardware.controller.js'


export const hardwareRouter = async (fastify, options) => {
    fastify.get('/hardware', async (request, reply) => {
        return reply.view('hardware', { currentPath: '/hardware' });
    });
    fastify.get('/api/hardware', hardwareController.getHardware);
    fastify.post('/api/hardware', hardwareController.createHardware);
    fastify.put('/api/hardware/:id', {
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
                    HA_NAME : { type: 'string' },
                    HA_TYPE: {  type: 'number' },
                    HA_MANUFACTURER: { type: 'string' },
                    HA_MODEL: { type: 'string' },
                    HA_SERIAL_NUMBER: { type: 'string' },
                    HA_PURCHASE_DATE: { type: 'string' },
                    HA_WARRANTY_EXPIRY_DATE: { type: 'string' },
                    LOC_NAME: {  type: 'number' },
                    ST_NAME: {  type: 'number' },
                    HA_LAST_MAINTENANCE_DATE: { type: 'string' },
                    HA_NOTES: { type: 'string' },
                    SIM_NUMBER: { type: 'string' },
                    HA_STORE: { type: 'number' },
                    HA_SUPPLIER: { type: 'number' },
                    HA_COST: { type: 'number' },
                    HA_CURRENCY: { type: 'number' },
                    HA_CONDITION: { type: 'string' },
                    HA_DEPLOYMENT_DATE: { type: 'string' },
                    HA_RETIREMENT_DATE: { type: 'string' },
                    HA_IP_ADDRESS: { type: 'string' },
                    HA_MAC_ADDRESS: { type: 'string' },
                },
                required: ['HA_NAME', 'HA_TYPE', 'HA_MANUFACTURER', 'HA_MODEL', 'HA_SERIAL_NUMBER', 'HA_PURCHASE_DATE', 'HA_WARRANTY_EXPIRY_DATE', 'LOC_NAME', 'ST_NAME', 'HA_LAST_MAINTENANCE_DATE', 'HA_NOTES', 'SIM_NUMBER', 'STORE_NAME', 'SUPPLIER_NAME', 'HA_COST', 'HA_CURRENCY', 'HA_CONDITION', 'HA_DEPLOYMENT_DATE', 'HA_RETIREMENT_DATE', 'HA_IP_ADDRESS', 'HA_MAC_ADDRESS']
            }
        },
    },   
    hardwareController.updateHardware);
    fastify.delete('/api/hardware/:id', hardwareController.deleteHardware);
};


