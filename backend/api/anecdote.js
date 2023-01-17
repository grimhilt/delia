const { DEBUG } = require("../modules/utils.js");
const bdd = require("../modules/bdd.js").bdd;
const statusCode = require("../modules/statusCode.js").statusCode;

function roomInfos(req, res) {
    const {token, room} = req.query;
    // get iteration with token
    bdd.query(`SELECT ancdt_rooms.iteration FROM ancdt_rooms INNER JOIN ancdt_users INNER JOIN users WHERE ancdt_users.room = ancdt_rooms.id AND users.token = "${token}" AND ancdt_rooms.id = "${room}" AND ancdt_users.user = users.id`, function (err, rows) {
        if (err || !rows || rows.length == 0) {
            return res.status(statusCode.FORBIDDEN).send();
        }
        
        // get users
        bdd.query(`SELECT users.id, users.username FROM users INNER JOIN ancdt_users ON ancdt_users.user = users.id WHERE ancdt_users.room = "${room}"`, function (err, users) {
            if (err || !rows || rows.length == 0) {
                return res.status(statusCode.FORBIDDEN).send();
            }
            return res.status(statusCode.OK).json({iteration: rows[0], users: users});
        });
    });
}

const isInRoom = (user, room) => {
    return new Promise(function (resolve, reject) {
        bdd.query(`SELECT ancdt_rooms.iteration FROM ancdt_rooms INNER JOIN ancdt_users WHERE ancdt_users.room = ancdt_rooms.id and ancdt_users.user = "${user}" and ancdt_rooms.id = "${room}";`, function (err, rows, fields) {
            if (err || !rows || rows.length == 0) {
                resolve(false);
            }
            resolve(true, rows);
        });
    });
};
  
function getUsers(req, res) {
    const {room, token} = req.body;
    //todo: check in room
    bdd.query(`SELECT users.id, users.username FROM users INNER JOIN ancdt_users ON ancdt_users.user = users.id WHERE ancdt_users.room = "${room}"`, function (err, rows, fields) {
        if (err || !rows) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
        }
        res.json(rows).status(statusCode.OK).send();
    });
}

function deadline(created, iteration, frequency, isAnswer) {

}

function save(req, res) {
    const {title, body, token, room, iteration} = req.body;
    // todo before deadline
    bdd.query(`SELECT ancdt_anecdotes.id FROM ancdt_anecdotes INNER JOIN users WHERE ancdt_anecdotes.user = users.id AND ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" AND users.token = "${token}"`, function(err, rows, fields) {
        if (err || !rows || rows.length == 0) {
            console.log(err || !rows || rows.length == 0)
            bdd.query(`INSERT INTO ancdt_anecdotes (user, room, iteration, title, body) SELECT users.id, "${room}", "${iteration}", "${title}", "${body}" FROM users INNER JOIN ancdt_users WHERE users.token = "${token}" AND ancdt_users.room = "${room}" AND ancdt_users.user = users.id`, function (err, results) {
                if (err) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
                }
                res.status(statusCode.OK).send();
            });
        } else {
            bdd.query(`UPDATE ancdt_anecdotes SET title = "${title}", body = "${body}" WHERE id = "${rows[0].id}"`, function(err, results) {
                if (err) {
                    return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
                }
                res.status(statusCode.OK).send();
            });
        }
    });
}


function load(req, res) {
    const {token, room, ancdt, iteration} = req.body;
    // own before deadline
    // other after deadline
}

function getAll(req, res) {
    const {token, room, iteration} = req.body;
    // if after deadline
    console.log(token, room, iteration)
    bdd.query(`SELECT ancdt_anecdotes.id, ancdt_anecdotes.title, ancdt_anecdotes.body FROM ancdt_anecdotes INNER JOIN users WHERE ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" AND users.token = "${token}"`, function(err, rows, fields) {
        if (err || !rows || rows.length == 0) {
            return res.status(statusCode.FORBIDDEN).send();
        }
        res.status(statusCode.OK).json(rows).send();
    });
}

// SELECT ancdt_anecdotes.id, ancdt_anecdotes.title, ancdt_anecdotes.body FROM ancdt_anecdotes INNER JOIN users WHERE ancdt_anecdotes.room = "1" AND ancdt_anecdotes.iteration = "0" AND users.token = "qbhlfao0jd7eufsukyb7";

function answer(req, res) {
    const {answer, token, room, ancdt, it} = req.body;
    // deadline
}

function getResult(req, res) {
    const {token, room, iteration} = req.body;
    // if after deadline
    // todo check token
    const result = {};
    bdd.query(`SELECT user, title FROM ancdt_anecdotes WHERE room = "${room}" AND iteration = "${iteration}" ORDER BY id`, function(err, rows, fields) {
        if (err || !rows || rows.length == 0) {
            return res.status(statusCode.FORBIDDEN).send();
        }
        result.ancdt = rows;
        bdd.query(`SELECT ancdt_answers.user, ancdt_answers.guessed_user FROM ancdt_answers INNER JOIN ancdt_anecdotes WHERE ancdt_answers.anecdote = ancdt_anecdotes.id AND ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" ORDER BY ancdt_answers.user, ancdt_anecdotes.id`, function(err, rows, fields) {
            if (err || !rows || rows.length == 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
            }
            result.result = rows;
            res.status(statusCode.OK).json(result).send();
        });
    });

}

module.exports = {
    ancdt_roomInfos: roomInfos,
    ancdt_users: getUsers,
    ancdt_save: save,
    ancdt_load: load,
    ancdt_getAll: getAll,
    ancdt_answer: answer,
    ancdt_getResult: getResult,
}