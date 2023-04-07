const fs = require('fs');
const axios = require('axios');

function getTheme(themeName) {
    const themesRawData = fs.readFileSync('./monkeytype-data/themes.json');
    const themesData = JSON.parse(themesRawData);

    for (let i = 0; i < themesData.length; i++) {
        const theme = themesData[i];
        if (theme.name === themeName) {
            return theme;
        }
    }

    let theme = {
        "name": "serika_dark",
        "bgColor": "#323437",
        "mainColor": "#e2b714",
        "subColor": "#646669",
        "textColor": "#d1d0c5"
    }

    return theme;

}

function getBadge(badgeId) {
    const badgesRawData = fs.readFileSync('./monkeytype-data/badges.json');
    const badgesData = JSON.parse(badgesRawData);
    return badgesData[badgeId];
}

async function getUserData(userId) {
    const API_KEY = process.env.MONKEYTYPE_APEKEY;
    const url = `https://api.monkeytype.com/users/${userId}/profile`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `ApeKey ${API_KEY}`
            },
        });
        const userData = response.data.data;
        return userData;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getTheme,
    getBadge,
    getUserData
};