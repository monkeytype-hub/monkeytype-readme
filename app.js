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
    if (userData === undefined) {
        res.send("User not found");
        return;
    }
    const theme = getTheme(themeName);
    let badge = null;
    if (userData.inventory !== null && userData.inventory !== undefined) {
        if (userData.inventory.badges.length !== 0) {
            badge = getBadge(userData.inventory.badges[0].id);
            for (let i = 0; i < userData.inventory.badges.length; i++) {
                if (userData.inventory.badges[i].selected === true) {
                    badge = getBadge(userData.inventory.badges[i].id);
                    break;
                }
            }
        }
    }
    const svg = await getSvg(userData, theme, badge, false);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
});

app.get('/generate-svg/:userId/:themeName/leaderboards', async (req, res) => {
    const userId = req.params.userId;
    const themeName = req.params.themeName;
    const userData = await getUserData(userId);
    if (userData === undefined) {
        res.send("User not found");
        return;
    }
    const theme = getTheme(themeName);
    let badge = null;
    if (userData.inventory !== null && userData.inventory !== undefined) {
        if (userData.inventory.badges.length !== 0) {
            badge = getBadge(userData.inventory.badges[0].id);
            for (let i = 0; i < userData.inventory.badges.length; i++) {
                if (userData.inventory.badges[i].selected === true) {
                    badge = getBadge(userData.inventory.badges[i].id);
                    break;
                }
            }
        }
    }
    const svg = await getSvg(userData, theme, badge, true);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
});

app.get('/GITPULL', (req, res) => {
    const { exec } = require('child_process');
    exec('git pull', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        res.send("GIT PULL SUCCESSFUL");
    });
});

app.listen(3000, () => {
    console.log('app listening on port 3000!');
});
