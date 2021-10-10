const {getVideos, insertVideoBuilder, getVideo} = require("../contollers/videos.controller")
const {getUser} = require("../contollers/auth.controller")
const {uploadFile, uploadFileDb} = require("../contollers/file.controller")

const Video = {
    id: {type: 'string'},
    name: {type: 'string'},
    link: {type: 'string'},
    owner: {type: 'string'},
    duration: {type: 'string'},
    quality: {type: 'string'},
    created: {type: 'number'},

}
const getVideoOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: Video
            }
        }
    }
}
const getVideosOptions = {
    schema: {
        response: {
            200: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: Video
                }
            }
        }
    }
}

function videosRoutes(fastify, option, done) {
    fastify.get('/api/videos', {...getVideosOptions, ...{preValidation: [fastify.authenticate]}}, async (request, reply) => {
        const {success, videos} = await getVideos()
        const code = success ? 200 : 404
        reply.status(code).send(videos || [])
    })
    fastify.get('/api/videos/:id', {...getVideoOptions, ...{preValidation: [fastify.authenticate]}}, async (request, reply) => {
        const {id} = request.params
        const {success, video} = await getVideo(id)
        const code = success ? 200 : 404
        reply.status(code).send(video)
    })
    fastify.post('/api/videos', async (request, reply) => {
        const video = request.body
        const dbResponse = await insertVideoBuilder(Object.values(video))
        const code = dbResponse.success ? 201 : 422
        try {
            if (dbResponse.success) {
                reply.status(code).send({success: true})
            } else {
                return new Error('User not found')
            }
        } catch ({message}) {
            reply.status(code).send({success: false, message})
        }
    })
    fastify.post('/api/video', async (request, reply) => {
        const file = request.raw.files.file
        const writeFileFs = await uploadFile(file)

        if (file.mimetype === 'video/webm' && writeFileFs) {

            const writeFileDb = await uploadFileDb(file, request.headers['x-user'])
            reply.code(201).send({success: writeFileDb})
        } else {
            return new Error("Not saved")
        }
    })
    done()
}

module.exports = videosRoutes
