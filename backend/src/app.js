const express = require("express");

const app = express();


const uploadRouter = require("../src/routes/uploadDoc.route");

app.use(express.json());
app.use('/api/docs' , uploadRouter);




module.exports = app