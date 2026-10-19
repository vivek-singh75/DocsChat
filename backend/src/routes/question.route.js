const express = require("express");

const questionRouter = express.Router()
const questionController  = require("../controller/question.controller");

questionRouter.post("/question" , questionController.userQuestion);



module.exports =questionRouter