const express = require("express");
const path = require("path");
const app = express();

const {
    getTheme,
    getBadge,
    getUserData,
    getMonkeyTypeThemesData,
    getMonkeyTypeBadgesData,
} = require("./public/script/monkeytypeData");
const { getOutputCSS } = require("./public/script/tailwindCSS");
const { getSvg } = require("./public/script/generateSvg");
const { get } = require("request");
require("dotenv").config();

app.use(express.static("public"));
app.use("/styles", express.static("dist"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.get("/", (req, res) => {
    const data = {
        domain: process.env.DOMAIN,
    };

    res.render("index", { data });
});

app.get(["/:userId/:themeName", "/:userId"], (req, res) => {
    const data = {
        domain: process.env.DOMAIN,
        userId: req.params.userId,
        theme: getTheme((req.params.themeName ? req.params.themeName : "serika_dark")),
        svgUrl: `${process.env.DOMAIN}/generate-svg/${req.params.userId}/${req.params.themeName}?lbpb=true`,
    };

    res.render("user", { data });
});

app.get("/generate-svg/:userId/:themeName", async (req, res) => {
    const userId = req.params.userId;
    const themeName = req.params.themeName;
    let leaderBoards = req.query.lb == "true" ? true : false;
    let personalBests = req.query.pb == "true" ? true : false;
    req.query.lbpb == "true" ? (leaderBoards = personalBests = true) : null;
    const userData = await getUserData(userId);
    const theme = getTheme(themeName);
    if (userData === undefined) {
        const svg = await getSvg(null, theme, null, false, false);
        res.set("Content-Type", "image/svg+xml");
        res.send(svg);
        return;
    }
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
    const svg = await getSvg(
        userData,
        theme,
        badge,
        leaderBoards,
        personalBests
    );
    res.set("Content-Type", "image/svg+xml");
    res.send(svg);
});

app.get("/monkeytype/theme", async (req, res) => {
    const themesData = await getMonkeyTypeThemesData();
    res.set("Content-Type", "application/json");
    res.send(themesData);
});

app.get("/monkeytype/badge", async (req, res) => {
    const badgesData = await getMonkeyTypeBadgesData();
    res.set("Content-Type", "application/json");
    res.send(badgesData);
});

app.get("/GITPULL", (req, res) => {
    const { exec } = require("child_process");
    exec("git pull", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        res.send("GIT PULL SUCCESSFUL");
    });
});

app.listen(3000, () => {
    console.log("app listening on port 3000!");
});
