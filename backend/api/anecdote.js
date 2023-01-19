const { DEBUG } = require("../modules/utils.js");
const bdd = require("../modules/bdd.js").bdd;
const statusCode = require("../modules/statusCode.js").statusCode;

const period= {
    write: 0,
    answer: 1,
    result: 2,
}

// INIT
bdd.query(`SELECT id, frequency, iteration, last FROM ancdt_rooms`, function(err, rows) {
    if (err || !rows || rows.length == 0) {
        return;
    }

    const now = new Date();
    let last;
    for (let i = 0; i < rows.length; i++) {
        last = new Date(rows[i].last);
        last.setSeconds(last.getSeconds() + rows[i].frequency);
        let wait = (last.getTime() - now.getTime()) / 1000;
        if (wait < 0) wait = 0;
        wait *= 1000;
        // todo_debug setTimeout(updateDeadline, wait, rows[i].id, rows[i].iteration, rows[i].frequency);
    }
});

function updateDeadline(id, iteration, frequency) {
    iteration++;
    // todo calc results -> points
    bdd.query(`UPDATE ancdt_rooms SET last = CURRENT_TIMESTAMP, iteration = "${iteration}"`, function(err, results) {
        if (err) {
            DEBUG.log(err);
        } else {
            setTimeout(updateDeadline, (frequency * 1000), id, (iteration), frequency);
        }
    });
}

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
            return res.status(statusCode.OK).json({iteration: rows[0].iteration, users: users});
        });
    });
}

const deadline = (id, iteration, periodType) => {
    iteration = parseInt(iteration)
    return new Promise(function(resolve, reject) {
        bdd.query(`SELECT last, iteration FROM ancdt_rooms WHERE id = "${id}"`, function(err, rows) {
            if (err || !rows || rows.length == 0) {
                reject();
            }
            resolve(
                periodType == period.result
                  ? rows[0].iteration > iteration + periodType
                  : rows[0].iteration == iteration + periodType
              );
        });
    })
}

function save(req, res) {
    const {title, body, token, room, iteration} = req.body;
    deadline(room, iteration, false).then((isIn) => {
        if (isIn) {
            bdd.query(`SELECT ancdt_anecdotes.id FROM ancdt_anecdotes INNER JOIN users WHERE ancdt_anecdotes.user = users.id AND ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" AND users.token = "${token}"`, function(err, rows, fields) {
                if (err || !rows || rows.length == 0) {
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
        } else {
            res.status(statusCode.FORBIDDEN).send();
        }
    }).catch(() => {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    });
}

function loadAncdt(req, res) {
    const {token, room, ancdt, iteration} = req.query;
    deadline(room, iteration, period.write).then((isIn) => {
        if (isIn) {
            bdd.query(`SELECT ancdt_anecdotes.title, ancdt_anecdotes.body FROM ancdt_anecdotes INNER JOIN users WHERE users.token = "${token}" AND ancdt_anecdotes.user = users.id AND ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration="${iteration}`, function(err, rows) {
                if (err || !rows || rows.length == 0) {
                    return res.status(statusCode.OK).send();
                }
                res.status(statusCode.OK).json(rows[0]);
            });
        } else {
            res.status(statusCode.FORBIDDEN).send();
        }
    }).catch(() => {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    });
    // own before deadline
    // other after deadline
}

// getAll anecdote to assign
function allAncdt(req, res) {
    const {token, room, iteration} = req.query;
    deadline(room, iteration, period.answer).then((isIn) => {
        if (isIn) {
            bdd.query(`SELECT ancdt_anecdotes.id, ancdt_anecdotes.title, ancdt_anecdotes.body FROM ancdt_anecdotes INNER JOIN users WHERE ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" AND users.token = "${token}"`, function(err, allAncdt) {
                if (err || !allAncdt || allAncdt.length == 0) {
                    return res.status(statusCode.FORBIDDEN).send();
                }
                bdd.query(`SELECT ancdt_answers.anecdote, ancdt_answers.guessed_user FROM ancdt_answers INNER JOIN users INNER JOIN ancdt_anecdotes WHERE users.token="${token}" AND users.id=ancdt_answers.user AND ancdt_anecdotes.room="${room}" AND ancdt_answers.anecdote=ancdt_anecdotes.id`, function(err, answers) {
                    if (err || !answers || answers.length == 0) {
                        return res.status(statusCode.OK).json({ancdts: allAncdt, answers: []});
                    }
                    res.status(statusCode.OK).json({ancdts: allAncdt, answers: answers});
                });
            });
        } else {
            res.status(statusCode.FORBIDDEN).send();
        }
    }).catch(() => {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    });
}

function answer(req, res) {
    const {guessed_user, token, room, ancdt, iteration} = req.body;
    deadline(room, iteration, period.answer).then((isIn) => {
        if (!isIn) {
            return res.status(statusCode.FORBIDDEN).send();
        }
        bdd.query(`DELETE ancdt_answers FROM ancdt_answers INNER JOIN users WHERE users.token="${token}" AND ancdt_answers.user=users.id AND ancdt_answers.anecdote="${ancdt}"`, function(err, results) {
            if (err) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
            }
            bdd.query(`INSERT INTO ancdt_answers (user, anecdote, guessed_user) SELECT users.id, "${ancdt}", "${guessed_user}" FROM users INNER JOIN ancdt_users WHERE users.token="${token}" AND users.id=ancdt_users.user AND ancdt_users.room="${room}"`, function(err, results) {
                if (err) {
                    return res.status(statusCode.FORBIDDEN).send();
                }
                res.status(statusCode.OK);
            });
        });
    }).catch(() => {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send();
    })
}

function getResult(req, res) {
    const {token, room, iteration} = req.body;
    // if after deadline
    // todo check token
    bdd.query(`SELECT user, title FROM ancdt_anecdotes WHERE room = "${room}" AND iteration = "${iteration}" ORDER BY id`, function(err, rows) {
        if (err || !rows || rows.length == 0) {
            return res.status(statusCode.FORBIDDEN).send();
        }
        bdd.query(`SELECT ancdt_answers.user, ancdt_answers.guessed_user FROM ancdt_answers INNER JOIN ancdt_anecdotes WHERE ancdt_answers.anecdote = ancdt_anecdotes.id AND ancdt_anecdotes.room = "${room}" AND ancdt_anecdotes.iteration = "${iteration}" ORDER BY ancdt_answers.user, ancdt_anecdotes.id`, function(err, answers) {
            if (err || !rows || rows.length == 0) {
                return res.status(statusCode.INTERNAL_SERVER_ERROR).send();
            }
            res.status(statusCode.OK).json({ancdt: rows, result: answers});
        });
    });
}

module.exports = {
    roomInfos: roomInfos,
    save: save,
    ancdt: loadAncdt,
    allAncdt: allAncdt,
    answer: answer,
    getResult: getResult,
}