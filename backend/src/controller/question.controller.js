const { textToVector } = require("../services/textToVector");
const sessions = require("../store/session.store");
const { solveQuery } = require("../services/ai.chat.service");
const { cosineSimilarity } = require("../services/findSimilarity");

async function userQuestion(req, res) {
    try {
        const { userQuery, sessionId } = req.body;

        // 1. Validate question
        if (!userQuery) {
            return res.status(400).json({
                success: false,
                message: "user input is not defined"
            });
        }

        // 2. Validate sessionId
        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "sessionId is not defined"
            });
        }

        // 3. Get session
        const session = sessions.get(sessionId);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found or session expired"
            });
        }

        // 4. Update activity
        session.lastActivity = Date.now();

        // 5. Get document chunks
        const allChunks = session.document.chunks;

        // 6. Create vector of user's question
        const queryVectorResponse = await textToVector(userQuery);

        if (!queryVectorResponse?.values) {
            throw new Error("Query vector was not generated");
        }

        const queryVector = queryVectorResponse.values;

        console.log("Query vector dimension:", queryVector.length);
        console.log("Total document chunks:", allChunks.length);
        console.log("First document vector dimension:",
            allChunks[0]?.vector?.values?.length
        );

        // 7. Calculate similarity
        const similarDocs = [];

        for (const chunk of allChunks) {

            if (!chunk.vector?.values) {
                console.warn(
                    `Skipping chunk ${chunk.chunkIndex}: vector missing`
                );
                continue;
            }

            const docsVector = chunk.vector.values;

            const score = cosineSimilarity(
                queryVector,
                docsVector
            );

            similarDocs.push({
                pageNumber: chunk.pageNumber,
                chunkIndex: chunk.chunkIndex,
                text: chunk.text,
                match: score
            });
        }

        // 8. Sort by similarity
        similarDocs.sort((a, b) => b.match - a.match);

        // 9. Get top 3 documents
        const topThree = similarDocs.slice(0, 3);

        console.log("Top matches:");
        console.log(
            topThree.map(doc => ({
                page: doc.pageNumber,
                chunk: doc.chunkIndex,
                score: doc.match
            }))
        );

        // 10. Generate answer using Gemini
        const response = await solveQuery(
            topThree,
            userQuery
        );

        // 11. Send response
        return res.status(200).json({
            success: true,
            response
        });

    } catch (error) {
        console.error("Question error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to process question",
            error: error.message
        });
    }
}

module.exports = {
    userQuestion
};