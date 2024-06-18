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

async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i < retries - 1) {
                await new Promise((resolve) =>
                    setTimeout(resolve, backoff * Math.pow(2, i)),
                );
            } else {
                console.error(error);
                throw error;
            }
        }
    }
}

async function getMonkeyTypeThemesData() {
    const themesList = await getMonkeyTypeThemesList();
    const themePromises = themesList.map(async (theme) => {
        const themeName = theme["name"];
        const themeData = await getMonkeyTypeThemesByName(themeName);
        themeData["name"] = themeName;
        return themeData;
    });

    const themesData = await Promise.all(themePromises);
    return themesData;
}

async function getMonkeyTypeThemesList() {
    const url =
        "https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/themes/_list.json";
    const response = await fetchWithRetry(url);
    const data = await response.json();
    return data;
}

async function getMonkeyTypeThemesByName(themeName) {
    const themeUrl = `https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/themes/${themeName}.css`;
    const response = await fetchWithRetry(themeUrl);
    let cssData = await response.text();

    cssData = cssData
        .substring(cssData.indexOf("{"), cssData.indexOf("}") + 1)
        .replace(/-(.)/g, (_, letter) => letter.toUpperCase())
        .replaceAll("-", "")
        .replaceAll(";", ",")
        .replace(/,\s*([^,]+)\s*$/, "$1")
        .replace(/([a-zA-Z0-9_]+)(?=:)/g, '"$1"')
        .replace(/\/\*.*?\*\//g, "")
        .replace(/(#[a-fA-F0-9]{3,8})(,|\s|$)/g, '"$1"$2')
        .replaceAll(" ", "")
        .replace(/(\})$/, "\n$1")
        .replace(/("font":\s*)(\w+)/, '$1"$2"');

    const resolveColorVariable = (variable) => {
        const colorName = variable.substring(4, variable.length - 1); // Extract color name without "var()" and ")"
        return cssData.match(new RegExp(`"${colorName}":"([^"]+)"`))[1];
    };

    cssData = cssData
        .replace(/var\([^)]+\)/g, resolveColorVariable)
        .replace(/(#[a-fA-F0-9]{3,8})(,|\s|$)/g, '"$1"$2');

    return JSON.parse(cssData);
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
