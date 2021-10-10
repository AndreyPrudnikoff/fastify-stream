const { getUsers, getOneUser, updateOneUser } = require("../contollers/users.contrtoller");

const User = {
    id: { type: 'string' },
    login: { type: 'string' },
    avatar: { type: 'string' },
    email: { type: 'string' },
    role: { type: 'string' },
}
const getUsersOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: User
                }
            }
        }
    }
}
const getUserOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: User
            }
        }
    }
}

function usersRoutes(fastify, option, done) {
    fastify.get('/api/users', { ...getUsersOptions, ...{ preValidation: [fastify.authenticate] } }, async (request, reply) => {
        const { success, users } = await getUsers()
        const code = success ? 200 : 500
        reply.status(code).send(users)
    })
    fastify.get('/api/users/:id', { ...getUserOptions, ...{ preValidation: [fastify.authenticate] } }, async (request, reply) => {
        const { id } = request.params
        const { success, user } = await getOneUser(id)
        const code = success ? 200 : 500
        reply.status(code).send(user)
    })
    fastify.patch('/api/users/:id', { ...getUserOptions, ...{ preValidation: [fastify.authenticate] } }, async (request, reply) => {
        const { id } = request.params
        const { body } = request
        const { success } = await updateOneUser(id, body)
        const code = success ? 200 : 500
        reply.status(code).send({ success })
    })
    done()
}

module.exports = usersRoutes
