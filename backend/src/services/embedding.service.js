const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_EMBEDDING_KEY
});

async function createVector(text) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-2",

        contents: text,

        config: {
            outputDimensionality: Number(
                process.env.VECTOR_DIMENSTION
            )
        }
    });

    return response?.embeddings?.[0];
}

module.exports = {
    createVector
};