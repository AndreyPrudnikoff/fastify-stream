const { v4: idv4 } = require('uuid')
const client = require('../db')

const insert = 'INSERT INTO videos(Id, Name, Link, Owner, Duration, Quality, Created) VALUES($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP(0))'

const get = 'select v.id, v.name, v.link, v.duration, v.quality, v.created, u.login as owner from videos v left join users u on v.owner=u.id'

async function insertVideoBuilder(values) {
    const array = [...values]
    array.unshift(idv4())
    try {
        const res = await client.query(insert, array)
        return { success: true }
    } catch ({ message }) {
        return { success: false, message }
    }
}

async function getVideos() {
    try {
        const res = await client.query(get)
        if (res.rows.length) {
            return { success: true, videos: res.rows }
        } else {
            return new Error('Videos not found')
        }
    } catch ({ message }) {
        return { success: false, message }
    }
}
async function getVideo(params) {
    const str = `where v.id = `
    const query = params ? `${ get } ${str}'${params}'` : get
    try {
        const res = await client.query(query)
        if (res.rows.length) {
            return { success: true, video: res.rows[0] }
        } else {
            return new Error('Video not found')
        }
    } catch ({ message }) {
        return { success: false, message }
    }
}

module.exports = { insertVideoBuilder, getVideos, getVideo }

