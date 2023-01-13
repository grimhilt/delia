const mysql = require("mysql");
const MYSQL = require("./config.json").mysql;
const { DEBUG, generateToken } = require("./modules/utils.js");
const sha1 = require("sha1");
const randomToken = require('random-token');

const bdd = mysql.createConnection({
    host: MYSQL.host,
    user: MYSQL.user,
    password: MYSQL.pwd,
    database: MYSQL.table,
});

bdd.connect(function (err) {
    if (err) {
        DEBUG.log("Impossible de se connecter", err.code);
    } else {
        DEBUG.log("Database successfully connected");
    }
});

const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.listen(process.env.PORT || 5500);

app.post("/api/signup", (req, res) => {
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(406).send();
    }

    bdd.query(`SELECT id FROM users WHERE username = "${username}"`, function (err, rows, fields) {
        if (rows[0]) {
            return res.status(401).send();
        }

        const token = randomToken(20);
        console.log(token);
        console.log(sha1(pwd))
        bdd.query(`INSERT INTO users (username, pwd, token) VALUES ("${username}", UNHEX("${sha1(pwd)}"), "${token}")`, function (err, results) {
            console.log(results);
            console.log(err)
            if (err) {
                return res.status(500).send();
            }
            res.status(200).json({ token: token });
        });
    });
});

app.post("/api/login", (req, res) => {
    const { username, pwd } = req.body;

    if (!pwd || !username) {
        return res.status(406).send();
    }

    bdd.query(`SELECT token FROM users WHERE username = "${username}" and pwd = UNHEX("${sha1(pwd)}")`, function (err, rows, fields) {
        console.log(rows)
        if (err) {
            console.log(err)
            return res.status(500).send();
        }
        if (!rows || rows.length == 0) {
            return res.status(401).send();
        }
        res.status(200).json({
            token: rows[0].token,
        });
    });
});

app.post("/api/profile", (req, res) => {
    const { token } = req.body;
    console.log(token)
    if (!token) {
        return res.status(406).send();
    }

    bdd.query(`SELECT id, username FROM users WHERE token = "${token}"`, function (err, rows, fields) {
        if (!rows || rows.length == 0) {
            return res.status(401).send();
        }

        if (err) {
            return res.status(500).send();
        }

        res.status(200).json({ id: rows[0].id, username: rows[0].username });
    });
});