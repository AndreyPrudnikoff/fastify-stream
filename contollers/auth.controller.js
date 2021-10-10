const { v4: idv4 } = require('uuid')
const crypto = require('crypto')
const client = require('../db')

const insert = 'INSERT INTO users(id, login, email, password, role) VALUES($1, $2, $3, $4, $5)'
const salt = "secretkeynumber1";

const get = 'select * from users where email = $1'

async function insertUserBuilder(values) {
    const array = [...values]
    array.unshift(idv4())
    try {
        array[3] = crypto.scryptSync(array[3], salt, 36).toString('hex')
        const res = await client.query(insert, array)
        return { success: true }
    } catch ({ message }) {
        return { success: false, message }
    }
}

async function getUser(values) {
    const [email, password] = [...values]
    try {
        const res = await client.query(get, [email])
        if (res.rows.length) {
            const { id } = res.rows[0]
            const success = res.rows[0].password === crypto.scryptSync(password, salt, 36).toString('hex')
            return { success, id }
        } else {
            return new Error('User not found')
        }
    } catch ({ message }) {
        return { success: false, message }
    }
}

module.exports = { insertUserBuilder, getUser }

