const express = require("express");
const compression = require("compression");
const path = require("path");
const axios = require("axios");
const app = express();

const {
    getTheme,
    getFaviconTheme,
    getBadge,
    getUserData,
    getMonkeyTypeThemesData,
    getMonkeyTypeBadgesData,
} = require("./public/script/monkeytypeData");
const { getOGSvg, getSvg } = require("./public/script/generateSvg");
require("dotenv").config();

app.use(compression());
app.use(express.static("public"));
app.use("/styles", express.static("dist"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

app.get("/", (req, res) => {
    const data = {
        domain: process.env.DOMAIN,
    };

    res.render("index", { data });
});

app.get("/mr-command/theme", async (req, res) => {
    try {
        const themesData = await getMonkeyTypeThemesData();
        res.set("Content-Type", "application/json");
        res.send(themesData);
    } catch (err) {
        console.error("Failed to fetch themes:", err);
        res.status(500).json({ error: "Failed to fetch themes" });
    }
});

app.get("/mr-command/badge", async (req, res) => {
    try {
        const badgesData = await getMonkeyTypeBadgesData();
        res.set("Content-Type", "application/json");
        res.send(badgesData);
    } catch (err) {
        console.error("Failed to fetch badges:", err);
        res.status(500).json({ error: "Failed to fetch badges" });
    }
});

app.get("/mr-command/favicon", async (req, res) => {
    try {
        const faviconData = getFaviconTheme();
        res.render("favicon", { faviconData });
    } catch (err) {
        console.error("Failed to render favicon:", err);
        res.status(500).send("Failed to render favicon");
    }
});

app.get("/mr-command/logo", async (req, res) => {
    try {
        const faviconData = getFaviconTheme();
        res.render("logo", { faviconData });
    } catch (err) {
        console.error("Failed to render logo:", err);
        res.status(500).send("Failed to render logo");
    }
});

app.get("/sitemap.xml", (req, res) => {
    res.sendFile(path.join(__dirname, "public/assets", "sitemap.xml"));
});

app.get("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, "public/assets", "robots.txt"));
});

app.get(
    ["/og-image/:userId/:themeName", "/og-image/:userId"],
    async (req, res) => {
        const userId = req.params.userId;
        const themeName = req.params.themeName;
        req.query.lbpb == "true" ? (leaderBoards = personalBests = true) : null;
        const userData = await getUserData(userId);
        const theme = getTheme(themeName);
        if (userData === undefined || userData.name === undefined) {
            const svg = await getOGSvg(null, theme, null);
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
        const ogSvg = await getOGSvg(userData, theme, badge);

        try {
            const response = await axios.post(
                "https://mr-api.zeabur.app/og-image",
                { og_svg: ogSvg },
                { responseType: "arraybuffer" },
            );

            res.setHeader("Content-Type", "image/png");
            res.send(Buffer.from(response.data, "binary"));
        } catch (error) {
            console.error("Error converting SVG to PNG:", error);
            res.status(500).send("Error converting SVG to PNG");
        }
    },
);

app.get(["/:userId/:themeName", "/:userId"], async (req, res) => {
    const data = {
        domain: process.env.DOMAIN,
        userId: req.params.userId,
        theme: getTheme(
            req.params.themeName ? req.params.themeName : "serika_dark",
        ),
        userData: await getUserData(req.params.userId),
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
    if (userData === undefined || userData.name === undefined) {
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
        personalBests,
    );
    res.set("Content-Type", "image/svg+xml");
    res.send(svg);
});

app.listen(process.env.PORT || 3000, async () => {
    console.log("Server started on port " + (process.env.PORT || 3000));
});
