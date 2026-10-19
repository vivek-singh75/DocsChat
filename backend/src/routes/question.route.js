const express = require("express");

const questionRouter = express.Router()
const questionController  = require("../controller/question.controller");

questionRouter.get("/question" , questionController.userQuestion);



module.exports =questionRouter