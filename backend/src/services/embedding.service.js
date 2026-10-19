const { GoogleGenAI } =  require("@google/genai");


async function createVector() {

    const ai = new GoogleGenAI({
        apiKey:process.env.GEMINI_EMBEDDING_KEY
    });

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: 'What is the meaning of life?',
    });

    //console.log(response?.embeddings);

    return response?.embeddings


}


module.exports  ={
    createVector
}
