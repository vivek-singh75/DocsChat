const { GoogleGenAI } =  require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function solveQuery(topThree, userQuery) {

    try {

        const context = topThree
            .map((doc, index) => {
                return `
                Document ${index + 1}
                Page: ${doc.pageNumber}
                Content:
                ${doc.text}
                `;
                            })
                            .join("\n----------------------\n");

                        const systemPrompt = `
                You are a document question-answering assistant.

                Your job is to answer the user's question using ONLY the information
                provided in the document context.

                Rules:
                1. Use the document context as the primary and only source of truth.
                2. Do not invent, assume, or hallucinate information.
                3. If the answer is clearly available in the context, answer it naturally
                  and directly.
                4. If the context does not contain enough information to answer the question,
                  say: "I couldn't find enough information about this in the document."
                5. Do not mention "chunks", "embeddings", "vectors", "RAG", or internal
                  retrieval processes to the user.
                6. Do not unnecessarily repeat the document.
                7. Keep the answer concise but explain enough to be useful.
                8. If the user asks for a list, use a list.
                9. If the user asks for an explanation, explain it in simple natural language.
                10. If relevant, mention the page number where the information was found.

                Document Context:
                ${context}
                `;

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash-lite",

            input: userQuery,

            system_instruction: systemPrompt
        });

        //console.log("AI Response:", interaction.output_text);

        return interaction.output_text;

    } catch (error) {

        console.error("solveQuery error:", error);

        throw error;
    }
}

module.exports = {
    solveQuery
};