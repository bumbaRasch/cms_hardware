// backend/src/routes/hardware.route.js
import {hardwareController} from '../controllers/hardware.controller.js'


export const hardwareRouter = async (fastify, options) => {
    fastify.get('/hardware', async (request, reply) => {
        return reply.view('hardware', { currentPath: '/hardware' });
    });
    fastify.get('/api/hardware', hardwareController.getHardware);
    fastify.post('/api/hardware', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    HA_NAME : { type: 'string' },
                    HT_ID: { type: 'number' },
                    HT_NAME: {  type: 'number' },
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
                    STORE_NAME: { type: 'number' },
                    SUPPLIER_NAME: { type: 'number' },
                    HA_COST: { type: 'number' },
                    CURRENCY_CODE: { type: 'number' },
                    HA_CONDITION: { type: 'string' },
                    HA_DEPLOYMENT_DATE: { type: 'string' },
                    HA_RETIREMENT_DATE: { type: 'string' },
                    HA_IP_ADDRESS: { type: 'string' },
                    HA_MAC_ADDRESS: { type: 'string' },
                },
                required: ['HA_NAME', 'HT_NAME', 'HA_MANUFACTURER', "ST_NAME", 'HA_MODEL', 'HA_SERIAL_NUMBER', 'HA_MAC_ADDRESS']
            }
        },
    }, hardwareController.createHardware);
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
                    HT_ID: { type: 'number' },
                    HT_NAME: {  type: 'number' },
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
                    STORE_NAME: { type: 'number' },
                    SUPPLIER_NAME: { type: 'number' },
                    HA_COST: { type: 'number' },
                    CURRENCY_CODE: { type: 'number' },
                    HA_CONDITION: { type: 'string' },
                    HA_DEPLOYMENT_DATE: { type: 'string' },
                    HA_RETIREMENT_DATE: { type: 'string' },
                    HA_IP_ADDRESS: { type: 'string' },
                    HA_MAC_ADDRESS: { type: 'string' },
                },
                required: ['HA_NAME', 'HT_NAME', 'HA_MANUFACTURER', 'HA_MODEL', 'HA_SERIAL_NUMBER', 'HA_MAC_ADDRESS']
            }
        },
    },   
    hardwareController.updateHardware);
    fastify.delete('/api/hardware/:id', hardwareController.deleteHardware);
};


