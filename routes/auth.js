const { insertUserBuilder, getUser } = require("../contollers/auth.controller")

function authRoutes(fastify, option, done) {
    fastify.post('/api/login', async (request, reply) => {
        const user = request.body
        const dbResponse = await getUser(Object.values({ email: user.email, password: user.password }))
        const code = dbResponse.success ? 200 : 422
        try {
            if (dbResponse.success) {
                const response = {success: dbResponse.success, id: dbResponse.id, token: fastify.jwt.sign({ id: dbResponse.id })}
                reply.status(code).send(response)
            } else {
                return new Error('User not found')
            }
        } catch ({ message }) {
            reply.status(code).send({ success: false, message })
        }
    })
    fastify.post('/api/register', async (request, reply) => {
        const user = request.body
        const response = await insertUserBuilder(Object.values(user))
        const code = response.success ? 201 : 422
        reply.status(code).send(response)
    })
    done()
}

module.exports = authRoutes
