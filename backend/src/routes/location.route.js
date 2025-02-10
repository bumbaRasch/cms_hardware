//backend/src/routes/location.route.js

import { locationController } from '../controllers/location.controller.js';

export const locationRouter = async (fastify, options) => {
    fastify.get('/locations', async (request, reply) => {
        return reply.view('locations', { currentPath: '/locations' });
    });
    fastify.get('/api/locations', locationController.getLocations);
    fastify.post('/api/locations', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    LOC_NAME: { type: 'string' },
                    LOC_ADDRESS: { type: 'string' },
                    LOC_CITY: { type: 'string' },
                    LOC_STATE: { type: 'string' },
                    LOC_COUNTRY: { type: 'string' },
                    LOC_POSTAL_CODE: { type: 'string' },
                    LOC_CONTACT_PERSON: { type: 'string' },
                    LOC_CONTACT_PHONE: { type: 'string' },
                    LOC_CONTACT_EMAIL: { type: 'string' },
                    LOC_DESCRIPTION: { type: 'string' },
                },
                required: ['LOC_NAME']
            }
        }
    }, locationController.createLocation);
    fastify.put('/api/locations/:id', {
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
                    LOC_NAME: { type: 'string' },
                    LOC_ADDRESS: { type: 'string' },
                    LOC_CITY: { type: 'string' },
                    LOC_STATE: { type: 'string' },
                    LOC_COUNTRY: { type: 'string' },
                    LOC_POSTAL_CODE: { type: 'string' },
                    LOC_CONTACT_PERSON: { type: 'string' },
                    LOC_CONTACT_PHONE: { type: 'string' },
                    LOC_CONTACT_EMAIL: { type: 'string' },
                    LOC_DESCRIPTION: { type: 'string' },
                },
                required: ['LOC_NAME']
            }
        }
    }, locationController.updateLocation);
    fastify.delete('/api/locations/:id', locationController.deleteLocation);
}