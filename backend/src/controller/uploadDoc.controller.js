const { extractTextFromPDF } = require("../services/pdf.service");
const { createChunks } = require("../services/chunk.service");

async function uploadDocs(req, res) {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No document uploaded"
            });
        }

        console.log("File received:", req.file.originalname);

        const pages = await extractTextFromPDF(req.file.path);

        const allChunks = [];

        for (const page of pages) {

            const chunks = createChunks(page.text);

            chunks.forEach((chunk, index) => {

                allChunks.push({
                    pageNumber: page.pageNumber,
                    chunkIndex: index,
                    text: chunk
                });

            });
        }

        console.log("Total chunks:", allChunks.length);

        console.log(allChunks);

        return res.status(200).json({
            success: true,
            message: "Document processed successfully",
            totalPages: pages.length,
            totalChunks: allChunks.length,
            chunks: allChunks
        });

    } catch (error) {

        console.error("Document processing error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process document"
        });
    }
}

module.exports = {
    uploadDocs
};