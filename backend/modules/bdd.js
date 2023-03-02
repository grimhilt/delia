const mysql = require("mysql");
const MYSQL = require("../config.json").mysql;
const { DEBUG } = require("../modules/utils.js");


const bdd = mysql.createConnection({
    host: MYSQL.host,
    user: MYSQL.user,
    password: MYSQL.pwd,
    database: MYSQL.database,
});

bdd.connect(function (err) {
    if (err) {
        DEBUG.log("Impossible de se connecter", err.code);
    } else {
        DEBUG.log("Database successfully connected");
    }
});

module.exports = {
    bdd: bdd,
};