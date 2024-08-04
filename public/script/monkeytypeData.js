const fs = require("fs");
let fetch;
import("node-fetch")
    .then((module) => {
        fetch = module.default;
    })
    .catch((err) => {
        console.error("Error while importing node-fetch:", err);
    });

const { library } = require("@fortawesome/fontawesome-svg-core");
const { fas } = require("@fortawesome/free-solid-svg-icons");
const { far } = require("@fortawesome/free-regular-svg-icons");
const { fab } = require("@fortawesome/free-brands-svg-icons");
const { findIconDefinition } = require("@fortawesome/fontawesome-svg-core");

library.add(fas, far, fab);

function getTheme(themeName) {
    const themesRawData = fs.readFileSync("./monkeytype-data/themes.json");
    const themesData = JSON.parse(themesRawData);
    let serika_dark = {};

    for (let i = 0; i < themesData.length; i++) {
        const theme = themesData[i];
        if (theme.name === themeName) {
            return theme;
        }
        if (theme.name === "serika_dark") {
            serika_dark = theme;
        }
    }

    return serika_dark;
}

function getFaviconTheme() {
    const themesRawData = fs.readFileSync("./monkeytype-data/themes.json");
    const themesData = JSON.parse(themesRawData);
    let faviconData = {};

    let data;
    for (let i = 0; i < themesData.length; i++) {
        data = {
            name: themesData[i].name,
            bgColor: themesData[i].bgColor,
            mainColor: themesData[i].mainColor,
            subColor: themesData[i].subColor,
            textColor: themesData[i].textColor,
        };
        faviconData[i] = data;
    }

    return faviconData;
}

function getBadge(badgeId) {
    const badgesRawData = fs.readFileSync("./monkeytype-data/badges.json");
    const badgesData = JSON.parse(badgesRawData);
    return badgesData[badgeId];
}

async function getUserData(userId) {
    const url = `https://api.monkeytype.com/users/${userId}/profile`;

    try {
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data.data;
            });
    } catch (error) {
        console.error(error);
    }
}

async function getMonkeyTypeThemesData() {
    const url = "https://mr-api.zeabur.app/themes";

    try {
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                return data;
            });
    } catch (error) {
        console.error(error);
    }
}

async function getMonkeyTypeBadgesData() {
    const url =
        "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/src/ts/controllers/badge-controller.ts";

    return fetch(url)
        .then((response) => response.text())
        .then((data) => {
            let badgesData = data.slice(
                data.search("{"),
                data.search("};") + 1,
            );
            badgesData = badgesData
                .replace(/(\w+)\s*:/g, '"$1":')
                .replace(/,(\s*[\]}])/g, "$1")
                .replace(
                    /(\w+:)|(\w+ :)/g,
                    (matchedStr) => '"' + matchedStr.replace(/:/g, "") + '":',
                )
                .replace(/\"/g, '"')
                .replace(/\"animation\"/g, "animation");
            badgesData = JSON.parse(badgesData);

            for (let i = 0; i < Object.keys(badgesData).length; i++) {
                let badge = badgesData[Object.keys(badgesData)[i]];
                if (badge.hasOwnProperty("customStyle")) {
                    if (
                        badge.customStyle ==
                        "animation: rgb-bg 10s linear infinite;"
                    ) {
                        badge.color = "white";
                        badge["background"] =
                            "animation: rgb-bg 10s linear infinite;";
                    }
                } else {
                    if (badge.color.includes("var")) {
                        badge.color = badge.color
                            .replace("var(--", "")
                            .replace(")", "")
                            .replace("-", "")
                            .replace("c", "C");
                    }
                    if (badge.background.includes("var")) {
                        badge.background = badge.background
                            .replace("var(--", "")
                            .replace(")", "")
                            .replace("-", "")
                            .replace("c", "C");
                    }
                }
                const iconSvg = findIconDefinition({
                    prefix: "fas",
                    iconName: `${badge.icon.replace("fa-", "")}`,
                });
                badge[
                    "iconSvg"
                ] = `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ${iconSvg["icon"][0]} ${iconSvg["icon"][1]}\" fill=\"\" width=\"12\" height=\"12\"><path d=\"${iconSvg["icon"][4]}\"/></svg>`;
            }

            badgesData = JSON.stringify(badgesData, null, 4);

            return badgesData;
        })
        .catch((error) => console.error(error));
}

module.exports = {
    getTheme,
    getFaviconTheme,
    getBadge,
    getUserData,
    getMonkeyTypeThemesData,
    getMonkeyTypeBadgesData,
};
