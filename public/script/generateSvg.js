const { getOutputCSS } = require("./tailwindCSS");

const request = require("request");
const fs = require("fs");

const downloadUserImg = (url, path) => {
    return new Promise((resolve, reject) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on("close", resolve)
                .on("error", reject);
        });
    });
};

const formatTopPercentage = (lbRank) => {
    if (lbRank.rank === undefined) return "-";
    if (lbRank.rank === 1) return "GOAT";
    let percentage = (lbRank.rank / lbRank.count) * 100;
    let formattedPercentage =
        percentage % 1 === 0 ? percentage.toString() : percentage.toFixed(2);
    return "Top " + formattedPercentage + "%";
};

async function getSvg(userData, theme, badge, leaderBoards, personalbests) {
    const width = 500;
    let height = 220;
    leaderBoards ? (height += 220) : (height += 0);
    personalbests ? (height += 440) : (height += 0);
    const cssData = await getOutputCSS();

    let userImg;
    let defaultUserImg = `
        <div class="h-20 w-20 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="${theme.subColor}">
                <path
                    d="M399 384.2C376.9 345.8 335.4 320 288 320H224c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>
        </div>
    `;
    if (
        userData === null ||
        userData.discordId === undefined ||
        userData.discordAvatar === undefined
    ) {
        userImg = defaultUserImg;
    } else {
        // Download the image and save it to a file
        const imagePath = `public/image/userImg/${userData.discordId}-${userData.discordAvatar}.png`;
        await downloadUserImg(
            `https://cdn.discordapp.com/avatars/${userData.discordId}/${userData.discordAvatar}.png?size=256`,
            imagePath,
        );

        // Convert the image file to base64
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString("base64");

        if (base64Image == "") {
            userImg = defaultUserImg;
        } else {
            userImg = `
                <div class="h-20 w-20 overflow-hidden rounded-full">
                    <img src="data:image/png;base64,${base64Image}" width="80" height="80" />
                </div>
            `;
        }
    }

    let userBadge = "";
    if (badge !== null) {
        let color;
        if (badge.color === "white") color = "white";
        else color = theme[badge.color];

        let bgColor;
        let bgTailwindColor = "";
        if (badge.background === "animation: rgb-bg 10s linear infinite;")
            bgTailwindColor = "animate-rgb-bg";
        bgColor = theme[badge.background];

        badge.iconSvg = badge.iconSvg.replace('fill=""', `fill="${color}"`);
        userBadge = `
            <div class="flex w-fit items-center justify-center rounded-md p-1 ${bgTailwindColor}" style="background: ${bgColor};">
                <div class="px-1">${badge.iconSvg}</div>
                <div class="px-1 align-middle font-mono text-xs" style="color: ${color};">
                    ${badge.name}
                </div>
            </div>
        `;
    }

    let leaderBoardHTML = "";
    if (leaderBoards == true) {
        topPercentage15 = formatTopPercentage(
            userData.allTimeLbs.time["15"]["english"],
        );
        topPercentage60 = formatTopPercentage(
            userData.allTimeLbs.time["60"]["english"],
        );

        leaderBoardHTML = `
            <div class="mt-5 w-full rounded-2xl" style="background-color: ${
                theme.bgColor
            }; height: 200px;">
                <div class="flex h-full items-center justify-center">
                    <div class="mx-5">
                        <div class="text-center font-mono text-lg font-medium tracking-wider" style="color: ${
                            theme.subColor
                        };">
                            All-Time English Leaderboards
                        </div>
                        <div class="mt-4 flex justify-center">
                            <div>
                                <div class="flex items-center justify-center py-1">
                                    <div>
                                        <div class="w-32 text-right font-mono text-lg font-medium tracking-wider"
                                            style="color: ${theme.subColor};">
                                            15 seconds
                                        </div>
                                        <div class="w-32 text-right font-mono text-xs font-medium tracking-wider"
                                            style="color: ${theme.subColor};">
                                            ${topPercentage15}
                                        </div>
                                    </div>
                                    <div class="w-33 ml-6 text-center font-mono text-3xl font-medium tracking-wider"
                                        style="color: ${theme.textColor};">
                                        ${
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"]
                                                ? userData.allTimeLbs.time[
                                                      "15"
                                                  ]["english"]["rank"]
                                                : "-"
                                        }
                                    </div>
                                    <div class="w-8 font-mono text-2xl font-medium tracking-wider"
                                        style="color: ${theme.textColor};">
                                        ${
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            1
                                                ? "st"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            2
                                                ? "nd"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            3
                                                ? "rd"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"] %
                                                10 >
                                                3 ||
                                            userData.allTimeLbs.time["15"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                                0
                                                ? "th"
                                                : ""
                                        }
                                    </div>
                                </div>
                                <div class="flex items-center justify-center py-1">
                                    <div>
                                        <div class="w-32 text-right font-mono text-lg font-medium tracking-wider"
                                            style="color: ${theme.subColor};">
                                            60 seconds
                                        </div>
                                        <div class="w-32 text-right font-mono text-xs font-medium tracking-wider"
                                                style="color: ${
                                                    theme.subColor
                                                };">
                                                ${topPercentage60}
                                        </div>
                                    </div>
                                    <div class="w-33 ml-6 text-center font-mono text-3xl font-medium tracking-wider"
                                        style="color: ${theme.textColor};">
                                        ${
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"]
                                                ? userData.allTimeLbs.time[
                                                      "60"
                                                  ]["english"]["rank"]
                                                : "-"
                                        }
                                    </div>
                                    <div class="w-8 font-mono text-2xl font-medium tracking-wider"
                                        style="color: ${theme.textColor};">
                                        ${
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            1
                                                ? "st"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            2
                                                ? "nd"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                            3
                                                ? "rd"
                                                : ""
                                        }
                                        ${
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"] %
                                                10 >
                                                3 ||
                                            userData.allTimeLbs.time["60"][
                                                "english"
                                            ]["rank"] %
                                                10 ==
                                                0
                                                ? "th"
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let personalbestsHTML = "";
    if (personalbests == true) {
        let pbTime = {};
        for (let j = 15; j <= 120; j *= 2) {
            let english_1k = true;
            let english = true;
            let english_1k_pb = null;
            let english_pb = null;
            if (userData.personalBests.time[j] != undefined) {
                for (
                    let i = 0;
                    i < userData.personalBests.time[j].length;
                    i++
                ) {
                    if (
                        userData.personalBests.time[j][i].language ==
                            "english_1k" &&
                        userData.personalBests.time[j][i].difficulty ==
                            "normal" &&
                        userData.personalBests.time[j][i].punctuation ==
                            false &&
                        english_1k == true
                    ) {
                        english_1k_pb = userData.personalBests.time[j][i];
                        english_1k = false;
                    }
                    if (
                        userData.personalBests.time[j][i].language ==
                            "english" &&
                        userData.personalBests.time[j][i].difficulty ==
                            "normal" &&
                        userData.personalBests.time[j][i].punctuation ==
                            false &&
                        english == true
                    ) {
                        english_pb = userData.personalBests.time[j][i];
                        english = false;
                    }
                }
                if (english_1k_pb == null && english_pb == null) {
                    pbTime[j] = { wpm: "-", acc: "-" };
                } else if (english_1k_pb != null && english_pb == null) {
                    pbTime[j] = english_1k_pb;
                } else if (english_1k_pb == null && english_pb != null) {
                    pbTime[j] = english_pb;
                } else {
                    if (english_1k_pb.wpm > english_pb.wpm) {
                        pbTime[j] = english_1k_pb;
                    } else {
                        pbTime[j] = english_pb;
                    }
                }
            } else {
                pbTime[j] = { wpm: "-", acc: "-" };
            }
            if (pbTime[j].wpm != "-") {
                pbTime[j].wpm = Math.round(parseFloat(pbTime[j].wpm));
            }
            if (pbTime[j].acc != "-") {
                if (pbTime[j].acc == null || pbTime[j].acc == undefined) {
                    pbTime[j].acc = "-";
                } else {
                    pbTime[j].acc = Math.floor(parseFloat(pbTime[j].acc));
                }
            }
        }

        let pbWords = {};
        let words = [10, 25, 50, 100];
        for (let i = 0; i < words.length; i++) {
            let english_1k = true;
            let english = true;
            let english_1k_pb = null;
            let english_pb = null;
            if (userData.personalBests.words[words[i]] != undefined) {
                for (
                    let j = 0;
                    j < userData.personalBests.words[words[i]].length;
                    j++
                ) {
                    if (
                        userData.personalBests.words[words[i]][j].language ==
                            "english_1k" &&
                        userData.personalBests.words[words[i]][j].difficulty ==
                            "normal" &&
                        userData.personalBests.words[words[i]][j].punctuation ==
                            false &&
                        english_1k == true
                    ) {
                        english_1k_pb =
                            userData.personalBests.words[words[i]][j];
                        english_1k = false;
                    }
                    if (
                        userData.personalBests.words[words[i]][j].language ==
                            "english" &&
                        userData.personalBests.words[words[i]][j].difficulty ==
                            "normal" &&
                        userData.personalBests.words[words[i]][j].punctuation ==
                            false &&
                        english == true
                    ) {
                        english_pb = userData.personalBests.words[words[i]][j];
                        english = false;
                    }
                }
                if (english_1k_pb == null && english_pb == null) {
                    pbWords[words[i]] = { wpm: "-", acc: "-" };
                } else if (english_1k_pb != null && english_pb == null) {
                    pbWords[words[i]] = english_1k_pb;
                } else if (english_1k_pb == null && english_pb != null) {
                    pbWords[words[i]] = english_pb;
                } else {
                    if (english_1k_pb.wpm > english_pb.wpm) {
                        pbWords[words[i]] = english_1k_pb;
                    } else {
                        pbWords[words[i]] = english_pb;
                    }
                }
            } else {
                pbWords[words[i]] = { wpm: "-", acc: "-" };
            }
            if (pbWords[words[i]].wpm != "-") {
                pbWords[words[i]].wpm = Math.round(
                    parseFloat(pbWords[words[i]].wpm),
                );
            }
            if (pbWords[words[i]].acc != "-") {
                if (
                    pbWords[words[i]].acc == null ||
                    pbWords[words[i]].acc == undefined
                ) {
                    pbWords[words[i]].acc = "-";
                } else {
                    pbWords[words[i]].acc = Math.floor(
                        parseFloat(pbWords[words[i]].acc),
                    );
                }
            }
        }

        personalbestsHTML = `
            <div class="mt-5 w-full rounded-2xl" style="background-color: ${
                theme.bgColor
            }; height: 200px;">
                <div class="flex h-full items-center justify-center">
                    <div class="mx-5">
                        <div class="flex items-center justify-around">
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    15 seconds
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["15"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["15"].acc}${
                                        pbTime["15"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    30 seconds
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["30"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["30"].acc}${
                                        pbTime["30"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    60 seconds
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["60"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["60"].acc}${
                                        pbTime["60"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    120 seconds
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["120"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbTime["120"].acc}${
                                        pbTime["120"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5 w-full rounded-2xl" style="background-color: ${
                theme.bgColor
            }; height: 200px;">
                <div class="flex h-full items-center justify-center">
                    <div class="mx-5">
                        <div class="flex items-center justify-around">
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    10 words
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["10"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["10"].acc}${
                                        pbWords["10"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    25 words
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["25"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["25"].acc}${
                                        pbWords["25"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    50 words
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["50"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["50"].acc}${
                                        pbWords["50"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                            <div class="mx-2 w-26 flex-col items-center justify-center">
                                <div class="py-1 text-center font-mono text-sm font-medium tracking-wider"
                                    style="color: ${theme.subColor};">
                                    100 words
                                </div>
                                <div class="py-1 text-center font-mono text-4xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["100"].wpm}
                                </div>
                                <div class="py-1 text-center font-mono text-2xl font-medium tracking-wider"
                                    style="color: ${theme.textColor};">
                                    ${pbWords["100"].acc}${
                                        pbWords["100"].acc == "-" ? "" : "%"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"
            class="rounded-2xl">
            <style>
                ${cssData}
            </style>
            <foreignObject x="0" y="0" width="${width}" height="${height}">
                <div xmlns="http://www.w3.org/1999/xhtml">
                    <div class="w-full rounded-2xl" style="background-color: ${
                        theme.bgColor
                    }; height: 200px;">
                        <div class="flex h-full items-center justify-center">
                            <div class="pr-5">${userImg}</div>
                            <div>
                                <div class="font-mono text-3xl font-medium tracking-wider" style="color: ${
                                    theme.textColor
                                };">
                                    ${
                                        userData == null
                                            ? "user not found"
                                            : userData.name
                                    }
                                </div>
                                ${
                                    badge != null
                                        ? `<div class="py-1">${userBadge}</div>`
                                        : ``
                                }
                                ${
                                    userData == null
                                        ? ""
                                        : userData.streak > 0
                                        ? `
                                        <div class="font-mono text-xs font-medium tracking-wide" style="color: ${theme.subColor};">
                                            Current streak: ${userData.streak} days
                                        </div>
                                    `
                                        : ``
                                }
                                </div>
                        </div>
                    </div>
                </div>

                <div xmlns="http://www.w3.org/1999/xhtml">${leaderBoardHTML}</div>

                <div xmlns="http://www.w3.org/1999/xhtml">${personalbestsHTML}</div>

                <div xmlns="http://www.w3.org/1999/xhtml" class="mt-5"></div>
            </foreignObject>
        </svg>
    `;
    return svg;
}

module.exports = {
    getSvg,
};
