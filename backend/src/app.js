import Fastify from 'fastify'
import routes from './routes/index.js'

const fastify = Fastify({
  logger: true
})

fastify.register(routes);
fastify.listen({ host: '0.0.0.0', port: 3000 }, (err, address) => {
    if (err) throw err
    fastify.log.info(`Server listening on ${address}`)
})