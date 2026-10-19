const express = require("express");
const multer = require("multer");

const { uploadDocs } = require("../controller/uploadDoc.controller");

const uploadRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage
});

uploadRouter.post(
    "/upload",
    upload.single("docsFile"),
    uploadDocs
);

module.exports = uploadRouter;
