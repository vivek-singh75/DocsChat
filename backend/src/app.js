const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://vivek-singh75.github.io"
];

app.use(cors({
    origin: function (origin, callback) {

        console.log("REQUEST ORIGIN:", origin);

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("BLOCKED ORIGIN:", origin);

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
}));

app.use(express.json());
app.use(express.text());

const uploadRouter = require("../src/routes/uploadDoc.route");
const questionRouter = require("../src/routes/question.route");

app.use("/api/docs", uploadRouter);
app.use("/api/user", questionRouter);

module.exports = app;