const fs = require('fs');
const axios = require('axios');

const { library, icon } = require('@fortawesome/fontawesome-svg-core');
const { fas } = require('@fortawesome/free-solid-svg-icons');
const { far } = require('@fortawesome/free-regular-svg-icons');
const { fab } = require('@fortawesome/free-brands-svg-icons');
const { findIconDefinition } = require('@fortawesome/fontawesome-svg-core');

library.add(fas, far, fab);

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

async function getMonkeyTypeBadgesData() {
    const url = 'https://api.github.com/repos/monkeytypegame/monkeytype/contents/frontend/src/ts/controllers/badge-controller.ts';

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const content = atob(data.content);
            let badgesData = content.slice(content.search('{'), content.search('};') + 1);
            badgesData = badgesData.replace(/(\w+)\s*:/g, '"$1":')
                .replace(/,(\s*[\]}])/g, '$1')
                .replace(/(\w+:)|(\w+ :)/g, (matchedStr) => '"' + matchedStr.replace(/:/g, '') + '":')
                .replace(/\"/g, '\"')
                .replace(/\"animation\"/g, 'animation');
            badgesData = JSON.parse(badgesData);

            for (let i = 0; i < Object.keys(badgesData).length; i++) {
                let badge = badgesData[Object.keys(badgesData)[i]];
                if (badge.hasOwnProperty("customStyle")) {
                    if (badge.customStyle == "animation: rgb-bg 10s linear infinite;") {
                        badge.color = "white";
                        badge["background"] = "linear-gradient(90deg, #A9C9FF 0%, #FFBBEC 100%)";
                    }
                } else {
                    if (badge.color.includes("var")) {
                        badge.color = badge.color.replace("var(--", "")
                            .replace(")", "")
                            .replace("-", "")
                            .replace("c", "C");
                    }
                    if (badge.background.includes("var")) {
                        badge.background = badge.background.replace("var(--", "")
                            .replace(")", "")
                            .replace("-", "")
                            .replace("c", "C");
                    }
                }
                const iconSvg = findIconDefinition({ prefix: 'fas', iconName: `${badge.icon.replace("fa-", "")}` });
                badge["iconSvg"] = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${iconSvg["icon"][0]} ${iconSvg["icon"][1]}\" fill=\"\" width=\"12\" height=\"12\"><path d=\"${iconSvg["icon"][4]}\"/></svg>`;
            }

            badgesData = JSON.stringify(badgesData, null, 4)

            return badgesData;
        })
        .catch(error => console.error(error));
}

module.exports = {
    getTheme,
    getBadge,
    getUserData,
    getMonkeyTypeBadgesData
};