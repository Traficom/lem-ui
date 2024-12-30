const fs = require("fs");
const crypto = require("crypto");

console.log("Reading files...");
const files = fs.readdirSync("out/prod/make/squirrel.windows/x64");
const exeFiles = files.filter(file => file.endsWith('.exe'));
console.log("Files found:", files);
console.log("Exes found:", exeFiles);

const results = exeFiles.map(file => {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(`out/prod/make/squirrel.windows/x64/${file}`)).digest("hex");
    return `${file} SHA256: ${hash}`;
});

console.log("Hashes generated:", results);

fs.writeFileSync("out/prod/make/squirrel.windows/x64/sha256sum.txt", results.join("\n"));
console.log("Hashes saved to sha256sum.txt");
