function wsRoutes(fastify, option, done) {
    fastify.get('/api/video-stream', { websocket: true }, (connection /* SocketStream */, req /* FastifyRequest */) => {
        connection.socket.on('message', message => {
            // message.toString() === 'hi from client'
            connection.socket.send('hi from server')
        })
    })
    done()
}

module.exports = wsRoutes
