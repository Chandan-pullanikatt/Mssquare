const { sanitizeFilename } = require('./lib/utils.ts');

const testCases = [
    { input: "Zoology 🔥.jpg", expected: "zoology.jpg" },
    { input: "My Awesome File (1).png", expected: "my-awesome-file-1.png" },
    { input: "  Spaces   .pdf  ", expected: "spaces.pdf" },
    { input: "Emoji 🚀 Test.webp", expected: "emoji-test.webp" },
    { input: "Multiple... Dots .html", expected: "multiple-dots.html" },
    { input: "---Hyphens---.svg", expected: "hyphens.svg" }
];

testCases.forEach(({ input, expected }) => {
    const output = sanitizeFilename(input);
    console.log(`Input: "${input}" -> Output: "${output}" | Pass: ${output === expected}`);
});
