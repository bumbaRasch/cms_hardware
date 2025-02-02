// backend/src/controllers/home.controller.js

export const homeController = {
    getHome: async (request, reply) => {
        return reply.view('index', { currentPath: '/' });
    }
};