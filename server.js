const fastify = require('fastify')({logger: true})
const path = require('path')
const client = require("./db")
const fs = require("fs")

const images = path.resolve(__dirname, './static')
if (!fs.existsSync(images)) fs.mkdirSync(images)

fastify.register(require('fastify-file-upload'))
fastify.register(require('fastify-websocket'))
fastify.register(require('fastify-jwt'), {secret: 'token'})
fastify.register(require('fastify-static'), {root: path.join(__dirname, '/static'), prefix: '/static/'})
fastify.register(require('fastify-cors'), {origin: ['http://localhost:3000']})

fastify.register(require('./routes/auth'))
fastify.register(require('./routes/users'))
fastify.register(require('./routes/videos'))
fastify.register(require('./routes/files'))
fastify.register(require('./routes/ws'))

fastify.decorate("authenticate", async function (request, reply) {
    try {
        await request.jwtVerify(request.raw.headers.authorization, (err, decode) => {
            if (err) {
                reply.status(401).send({statusCode: 401, message: 'Unauthorized'})
            } else if (3600 < (Math.round(Date.now() / 1000) - decode.iat)) {
                // const { id, iat } = decode
                reply.status(401).send({statusCode: 401, message: 'Unauthorized'})
            }

        })
    } catch (err) {
        reply.send(err)
    }
})

// fastify.get('/', async (request, reply) => {
//     return reply.sendFile('index.html')
// })


const start = async () => {

    try {
        await client.connect()
        await fastify.listen(5000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
