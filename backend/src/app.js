const express = require("express");

const app = express();


const uploadRouter = require("../src/routes/uploadDoc.route");

const questionRouter = require("../src/routes/question.route");

app.use(express.json());
app.use(express.text());


app.use('/api/docs' , uploadRouter);

app.use("/api/user" , questionRouter);




module.exports = app