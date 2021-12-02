const client = require('../db')

const get = 'SELECT * FROM users'
const getOne = 'SELECT * FROM users WHERE id = '
const updateOne = 'UPDATE users SET ### WHERE id ='

async function getUsers() {
    try {
        const res = await client.query(get)
        return { success: true, users: res.rows }
    } catch ({ message }) {
        return { success: false, message }
    }
}

async function getOneUser(id) {
    try {
        const res = await client.query(`${getOne} '${id}';`)
        return { success: true, user: res.rows[0] }
    } catch ({ message }) {
        return { success: false, message }
    }
}

async function updateOneUser(id, body) {
    try {
        let str = ''
        const keys = Object.keys(body)
        keys.forEach((k, i) => {
            if (body[k] !== id) {
                if (keys.length - 1 === i) {
                    str += k + '=' + (`'${body[k]}'` || null) + ' '
                } else {
                    str += k + '=' + (`'${body[k]}'` || null) + ', '
                }
            }
        })
        const queryString = updateOne.replace('###', str)
        const res = await client.query(`${queryString}'${id}';`)
        return { success: true }
    } catch ({ message }) {
        return { success: false, message }
    }
}

module.exports = { getUsers, getOneUser, updateOneUser }
