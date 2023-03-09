const bdd = require("./modules/bdd.js").bdd;

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
const userRouter = require("./routers/user");
app.use("/api/auth", userRouter);

// anecdote
const ancdtRouter = require("./routers/anecdote");
app.use("/api/ancdt", ancdtRouter);
