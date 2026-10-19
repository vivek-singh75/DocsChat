const express = require("express");

const app = express();
const cors =require("cors")

const allowedOrigins = [
    "http://localhost:5173",
    "https://your-frontend-domain.com"
];

app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without origin
        // such as Postman
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    }
}));

const uploadRouter = require("../src/routes/uploadDoc.route");

const questionRouter = require("../src/routes/question.route");

app.use(express.json());
app.use(express.text());


app.use('/api/docs' , uploadRouter);

app.use("/api/user" , questionRouter);




module.exports = app