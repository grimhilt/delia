const bdd = require("./modules/bdd.js").bdd;

const {login, signup, profile} = require("./api/user.js");
const ancdt = require("./api/anecdote.js");


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

// user
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/profile", profile);

// anecdote
app.get("/api/ancdt/roomInfos", ancdt.ancdt_roomInfos);
app.post("/api/ancdt/users", ancdt.ancdt_users);
app.post("/api/ancdt/save", ancdt.ancdt_save);
app.post("/api/ancdt/load", ancdt.ancdt_load);
app.post("/api/ancdt/getall", ancdt.ancdt_getAll);
app.post("/api/ancdt/choices", ancdt.ancdt_answer);
app.post("/api/ancdt/results", ancdt.ancdt_getResult);



