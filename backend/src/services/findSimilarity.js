function cosineSimilarity(a, b) {

    if (!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error("Both vectors must be arrays");
    }

    if (a.length !== b.length) {
        throw new Error(
            `Vector dimensions do not match: ${a.length} vs ${b.length}`
        );
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {

        dotProduct += a[i] * b[i];

        magnitudeA += a[i] * a[i];

        magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
}

module.exports = {
    cosineSimilarity
};