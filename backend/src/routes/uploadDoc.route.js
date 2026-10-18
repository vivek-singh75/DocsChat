const express = require("express");
const multer = require("multer");

const { uploadDocs } = require("../controller/uploadDoc.controller");

const uploadRouter = express.Router();

const upload = multer({
    dest: "uploads/"
});

uploadRouter.post(
    "/upload",
    upload.single("docsFile"),
    uploadDocs
);

module.exports = uploadRouter;
