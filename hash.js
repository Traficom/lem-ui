const fs = require("fs");
const crypto = require("crypto");

console.log("Reading files from 'dist'...");
const files = fs.readdirSync("dist");
console.log("Files found:", files);

const results = files.map(file => {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(`out/prod/make/${file}`)).digest("hex");
    return `${file}: ${hash}`;
});

console.log("Hashes generated:", results);

fs.writeFileSync("dist/sha256sum.txt", results.join("\n"));
console.log("Hashes saved to dist/sha256sum.txt");
