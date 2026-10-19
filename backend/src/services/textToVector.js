const { createVector } = require("../services/embedding.service");

async function textToVector(chunks) {
    try {
        if (!chunks) {
            throw new Error("Chunks was not received");
        }

        // Agar ek string hai → ek vector
        if (typeof chunks === "string") {
            return await createVector(chunks);
        }

        // Agar array hai → har chunk ka vector
        const vectors = [];

        for (const chunk of chunks) {
            const vector = await createVector(chunk);
            vectors.push(vector);
        }

        return vectors;

    } catch (error) {
        console.log(`embedding error: ${error.message}`);
        throw error;
    }
}

module.exports = {
    textToVector
};