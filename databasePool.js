const mysql = require('mysql');
const setting = require('./setting.json');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: setting.DB.host,
    port: setting.DB.port,
    user: setting.DB.user,
    password: setting.DB.password,
    database: setting.DB.name
});

const executeQuery = async (query, values, callback) => {
    if (typeof (values) === 'function') {
        callback = values;
        values = '';
    }
    pool.getConnection(function (error, db) {
        if (error) {
            console.log(error);
        }
        else {
            db.query(query, values, function (error, result) {
                db.release();
                callback(error, result);
            });
        }
    });
}

module.exports = {
    findAllKeyword: async (callback) => executeQuery("SELECT * FROM tb_keyword WHERE is_filtered = ?", [ 1 ], callback),
    findMoaByTitle: async (title, callback) => executeQuery("SELECT * FROM tb_moa WHERE title = ?", [ title ], callback),
    insertMoa: async (created_by, content, img_url, is_deleted, source, title, url, keyword_seq, callback) =>
        executeQuery("INSERT INTO tb_moa(created_by, content, img_url, is_deleted, source, title, url, keyword_seq) values(?, ?, ?, ?, ?, ?, ?, ?)",
            [ created_by, content, img_url, is_deleted, source, title, url, keyword_seq ], callback),
}