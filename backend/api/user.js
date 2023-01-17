const sha1 = require("sha1");
const randomToken = require('random-token');
const { DEBUG } = require("../modules/utils.js");
const bdd = require("../modules/bdd.js").bdd;
const { statusCode } = require("../modules/statusCode.js");

function login(req, res) {
    const { username, pwd } = req.body;

    if (!pwd || !username) {
        return res.status(statusCode.NOT_ACCEPTABLE).send();
    }

    bdd.query(`SELECT token FROM users WHERE username = "${username}" and pwd = UNHEX("${sha1(pwd)}")`, function (err, rows, fields) {
        DEBUG.log(rows)
        if (err) {
            DEBUG.log(err)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
        }
        if (!rows || rows.length == 0) {
            return res.status(statusCode.UNAUTHORIZED).send();
        }
        res.status(statusCode.OK).json({
            token: rows[0].token,
        });
    });
}

function signup(req, res) {
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(statusCode.NOT_ACCEPTABLE).send();
    }

    bdd.query(`SELECT id FROM users WHERE username = "${username}"`, function (err, rows, fields) {
        if (rows[0]) {
            return res.status(statusCode.UNAUTHORIZED).send();
        }

        const token = randomToken(20);
        console.log(token);
        console.log(sha1(pwd))
        bdd.query(`INSERT INTO users (username, pwd, token) VALUES ("${username}", UNHEX("${sha1(pwd)}"), "${token}")`, function (err, results) {
            console.log(results);
            console.log(err)
            if (err) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
            }
            res.status(statusCode.OK).json({ token: token });
        });
    });
}

function profile(req, res) {
    const { token } = req.body;
    if (!token) {
        return res.status(statusCode.NOT_ACCEPTABLE).send();
    }

    bdd.query(`SELECT id, username FROM users WHERE token = "${token}"`, function (err, rows, fields) {
        if (!rows || rows.length == 0) {
            return res.status(statusCode.UNAUTHORIZED).send();
        }

        if (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
        }

        res.status(statusCode.OK).json({ id: rows[0].id, username: rows[0].username });
    });
}

module.exports = {
    login: login,
    signup: signup,
    profile: profile,
};