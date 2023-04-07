const express = require('express');
const app = express();

const axios = require('axios');
const { getTheme, getBadge } = require('./public/script/monkeytypeData');
const { getOutputCSS } = require('./public/script/tailwindCSS');
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('MonkeyType README!');
});

app.get('/generate-svg/:userId', async (req, res) => {
    const userId = req.params.userId;

    const API_KEY = process.env.MONKEYTYPE_APEKEY;
    const url = `https://api.monkeytype.com/users/${userId}/profile`;

    const width = 500;
    const height = 200;
    const cssData = await getOutputCSS();
    console.log(cssData)

    axios.get(url, {
        headers: {
            'Authorization': `ApeKey ${API_KEY}`
        },
    })
        .then((response) => {
            const userData = response.data.data;
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
                    <style>
                        ${cssData}
                    </style>
                    <rect x="0" y="0" width="${width}" height="${height}"/>
                    <foreignObject x="0" y="0" width="${width}" height="${height}" class="bg-white">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            <h1 class="font-extrabold text-yellow-400">Hello MonkeyType README !!!</h1>
                        </div>
                    </foreignObject>
                </svg>
            `;
            res.set('Content-Type', 'image/svg+xml');
            res.send(svg);
        })
        .catch((error) => {
            console.error(error);
        });
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});
