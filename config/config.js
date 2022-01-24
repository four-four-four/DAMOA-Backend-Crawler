const mysql = require('mysql');

module.exports = {
    getConnection : mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'@@@@@',
        database:'DAMOA'
    })
}
