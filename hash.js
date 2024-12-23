const fs = require("fs");
const crypto = require("crypto");

console.log("Reading files...");
const files = fs.readdirSync("out/prod/make/");
console.log("Files found:", files);

const results = files.map(file => {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(`out/prod/make/${file}`)).digest("hex");
    return `${file}: ${hash}`;
});

console.log("Hashes generated:", results);

fs.writeFileSync("out/prod/make/sha256sum.txt", results.join("\n"));
console.log("Hashes saved to sha256sum.txt");
