const fs = require('fs');

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

module.exports = {
    getTheme,
    getBadge
};