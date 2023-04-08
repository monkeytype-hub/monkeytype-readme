const { getOutputCSS } = require('./tailwindCSS');

const request = require('request');
const fs = require('fs');

const downloadUserImg = (url, path) => {
    return new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', resolve)
                .on('error', reject);
        });
    });
};

async function getSvg(userData, theme) {
    const width = 500;
    const height = 200;
    const cssData = await getOutputCSS();

    let userImg;
    if (userData.discordId === null || userData.discordAvatar === undefined) {
        userImg = `
            <div class="w-20 h-20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="${theme.subColor}">
                    <path d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"/>
                </svg>
            </div>
        `;
    } else {
        // Download the image and save it to a file
        const imagePath = `public/image/userImg/${userData.discordId}-${userData.discordAvatar}.png`;
        await downloadUserImg(`https://cdn.discordapp.com/avatars/${userData.discordId}/${userData.discordAvatar}.png?size=256`, imagePath);

        // Convert the image file to base64
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');

        userImg = `
            <div class="w-20 h-20 rounded-full overflow-hidden">
                <img src="data:image/png;base64,${base64Image}" width="80" height="80"/>
            </div>
        `;
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="rounded-2xl">
            <style>
                ${cssData}
            </style>
            <foreignObject x="0" y="0" width="${width}" height="${height}" class="bg-white">
                <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full" style="background-color: ${theme.bgColor};">
                    <div class="flex justify-center items-center h-full">
                        <div class="mx-5">
                            ${userImg}
                        </div>
                        <div>
                            <span class="text-3xl font-medium tracking-wider"
                                style="color: ${theme.textColor};">${userData.name}</span>
                        </div>
                    </div>
                </div>
            </foreignObject>
        </svg>
    `
    return svg;
}

module.exports = {
    getSvg
};