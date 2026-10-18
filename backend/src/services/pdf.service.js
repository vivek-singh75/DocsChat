const fs = require("fs");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.mjs");

async function extractTextFromPDF(filePath) {

    const data = new Uint8Array(
        fs.readFileSync(filePath)
    );

    const pdf = await pdfjsLib.getDocument({
        data
    }).promise;

    const pages = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {

        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const text = content.items
            .map(item => item.str)
            .join(" ");

        pages.push({
            pageNumber,
            text
        });
    }

    return pages;
}

module.exports = {
    extractTextFromPDF
};