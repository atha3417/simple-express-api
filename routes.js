const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.databaseName
});
connection.connect();

function query(sql, callback) {
    connection.query(sql, (error, results) => {
        if (error) {
            callback(error);
        }
        callback(results);
    });
}

function setResponse(status, message, data) {
    return {
        status,
        message,
        data
    };
}

router.get('/users', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let limit = req.query.limit || 10;
    query(`SELECT id, name, username, email FROM users LIMIT ${limit}`, results => {
        res.send(setResponse('success', undefined, results));
        res.end();
    });
});

router.post('/users', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    ({
        name,
        username,
        email,
        password
    } = req.body);
    if (!name || !username || !email || !password) {
        res.status(400).send({
            status: 'error',
            message: 'data yang dibutuhkan tidak lengkap'
        });
        res.end();
    } else {
        let sql = `INSERT INTO users (
                    name, username, email, password
                ) VALUES (
                    '${name}', '${username}', '${email}', '${password}'
                )`;
        query(sql, () => {
            res.send({
                status: 'success',
                message: 'user baru berhasil ditambahkan',
                data: {
                    name,
                    username,
                    email
                }
            });
            res.end();
        });
    }
});


router.get('/user/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let sql = `SELECT id, username, name, email FROM users WHERE id = ${req.params.id}`;
    query(sql, result => {
        res.send(setResponse('success', 'user berhasil ditemukan', result[0]));
        res.end();
    });
});

router.put('/user/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    ({
        name,
        username,
        email,
        password
    } = req.body);
    if (!name || !username || !email || !password) {
        res.status(400).send(setResponse('error', 'data yang dibutuhkan tidak lengkap', undefined));
        res.end();
    } else {
        let sql = `UPDATE users 
            SET name = '${name}', 
            username = '${username}', 
            email = '${email}', 
            password = '${password}' 
            WHERE id = ${req.params.id}`;
        query(sql, () => {
            res.send(setResponse('success', 'user telah diubah', {
                name,
                username,
                email
            }));
            res.end();
        });
    }
});

router.delete('/user/:id', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    let sql = `DELETE FROM users WHERE id = ${req.params.id}`;
    query(sql, () => {
        res.send(setResponse('success', 'user berhasil dihapus', undefined));
        res.end();
    });
});

module.exports = router;