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
app.get("/api/ancdt/rooms", ancdt.rooms);
app.get("/api/ancdt/roomInfos", ancdt.roomInfos);
app.get("/api/ancdt/ancdt", ancdt.ancdt);
app.get("/api/ancdt/answersInfo", ancdt.answersInfo);
app.post("/api/ancdt/save", ancdt.save);
app.post("/api/ancdt/answer", ancdt.answer);
app.post("/api/ancdt/results", ancdt.getResult);




