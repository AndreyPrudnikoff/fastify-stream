const {uploadFile} = require("../contollers/file.controller");

function filesRoutes(fastify, option, done) {
    fastify.post('/api/file', async (request, reply) => {
        const file = request.raw.files.file
        const writeFile = await uploadFile(file)

        reply.code(201).send({success: writeFile})
    })
    done()
}

module.exports = filesRoutes
