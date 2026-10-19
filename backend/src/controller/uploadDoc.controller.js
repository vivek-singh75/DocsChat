const { extractTextFromPDF } = require("../services/pdf.service");
const { createChunks } = require("../services/chunk.service");
const { textToVector } = require("../services/textToVector");
const crypto = require("crypto");

const sessions = require("../store/session.store");

async function uploadDocs(req, res) {

    try {

        // 1. Check uploaded file
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No document uploaded"
            });
        }

        console.log(
            "File received:",
            req.file.originalname
        );

        // 2. Extract text from PDF
        const pages = await extractTextFromPDF(
            req.file.buffer
        );

        const allChunks = [];

        // 3. Process every page
        for (const page of pages) {

            // Create chunks from page text
            const chunks = createChunks(
                page.text
            );

            // 4. Create embeddings for chunks
            const vectors = await textToVector(
                chunks
            );

            console.log(
                `Page ${page.pageNumber} -> chunks: ${chunks.length}, vectors: ${vectors.length}`
            );

            // 5. Store chunk + its vector
            chunks.forEach((chunk, index) => {

                const vector = vectors[index];

                if (!vector || !vector.values) {
                    throw new Error(
                        `Vector missing for page ${page.pageNumber}, chunk ${index}`
                    );
                }

                allChunks.push({
                    pageNumber: page.pageNumber,
                    chunkIndex: index,
                    text: chunk,
                    vector: vector
                });

            });
        }

        console.log(
            "Total chunks:",
            allChunks.length
        );

        // 6. Create session
        const sessionId = crypto.randomUUID();

        // 7. Store session
        sessions.set(sessionId, {

            sessionId,

            lastActivity: Date.now(),

            document: {
                fileName: req.file.originalname,
                totalPages: pages.length,
                chunks: allChunks
            }

        });

        console.log(
            "SESSION CREATED:",
            sessionId
        );

        console.log(
            "ALL SESSION IDS:",
            [...sessions.keys()]
        );

        // 8. Response
        return res.status(200).json({

            success: true,

            message:
                "Document processed successfully",

            sessionId,

            document: {
                fileName:
                    req.file.originalname,

                totalPages:
                    pages.length,

                totalChunks:
                    allChunks.length
            }

        });

    } catch (error) {

        console.error(
            "Document processing error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to process document",

            error:
                error.message

        });

    }
}

module.exports = {
    uploadDocs
};