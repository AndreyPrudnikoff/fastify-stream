const fs = require('fs/promises')
const path = require('path')
const {insertVideoBuilder} = require("../contollers/videos.controller");
const ffprobe = require('ffprobe')
const ffprobeStatic = require('ffprobe-static');

async function uploadFile(file) {
    try {
        return fs.writeFile(path.resolve(__dirname, '../static', file.name), file.data,)
            .then(() => true)
            .catch(() => false)

    } catch {
        return false
    }
}

async function uploadFileDb(file, id, duration) {
    const pathVideo = path.resolve(__dirname, '../static', file.name)
    ffprobe(pathVideo, {path: ffprobeStatic.path}, async (err, info) => {
        if (err) throw err;
        const video = info.streams[0]
        const videoDefault = {
            name: file.name.split('.').shift(),
            link: `http://localhost:5000/static/${file.name}`,
            owner: id,
            duration: duration,
            quality: video.width + '*' + video.height
        }
        return await insertVideoBuilder(Object.values(videoDefault))
    })

}

module.exports = {uploadFile, uploadFileDb}
