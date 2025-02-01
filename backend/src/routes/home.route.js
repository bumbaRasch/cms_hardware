// backend/src/routes/home.route.js
import {homeController} from '../controllers/home.controller.js'

export const homeRouter = async (fastify, options) => {
    fastify.get('/', homeController.getHome);
}