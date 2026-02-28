const mysql = require("mysql2/promise");

const db = mysql.createPool({

host: "localhost",

user: "root",

password: "Kunal#@1020",

database: "code_engine",

});

module.exports = db;