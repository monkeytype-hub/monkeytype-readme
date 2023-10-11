const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

async function getOutputCSS() {
    try {
        const data = await readFile("public/style/output.css", "utf-8");
        return data;
    } catch (err) {
        console.error(err);
        return;
    }
}

module.exports = {
    getOutputCSS,
};
