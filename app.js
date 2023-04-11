const express = require('express');
const app = express();

const { getTheme, getBadge, getUserData } = require('./public/script/monkeytypeData');
const { getOutputCSS } = require('./public/script/tailwindCSS');
const { getSvg } = require('./public/script/generateSvg');
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('MonkeyType README!');
});

app.get('/generate-svg/:userId/:themeName', async (req, res) => {
    const userId = req.params.userId;
    const themeName = req.params.themeName;
    const userData = await getUserData(userId);
    const theme = getTheme(themeName);
    const badge = (userData.inventory !== undefined) ? getBadge(userData.inventory.badges[0].id) : null;
    const svg = await getSvg(userData, theme, badge);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});
