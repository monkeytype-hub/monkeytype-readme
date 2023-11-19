const PocketBase = require("pocketbase/cjs");
const FormData = require("form-data");
const axios = require("axios");
const stream = require("stream");
const { promisify } = require("util");
require("dotenv").config();

const pb = new PocketBase("https://pocket-monkeytype-readme.zeabur.app");
const pbDomain = process.env.PB_DOMAIN;
const pbEmail = process.env.PB_EMAIL;
const pbPassword = process.env.PB_PASSWORD;

async function authenticate() {
    try {
        const authData = await pb.admins.authWithPassword(pbEmail, pbPassword);
        console.log("Authentication successful:", authData);
        return authData.token;
    } catch (error) {
        console.error("Authentication failed:", error);
    }
}

const imageData = [
    {
        monkeytype_name: "rocket",
        theme: "botanical",
        type: ["", "lb", "pb", "lbpb"],
    },
    {
        monkeytype_name: "miodec",
        theme: "nord_light",
        type: ["", "lb", "pb", "lbpb"],
    },
    {
        monkeytype_name: "rocket",
        theme: "slambook",
        type: ["lbpb"],
    },
    {
        monkeytype_name: "UTF8",
        theme: "camping",
        type: [""],
    },
    {
        monkeytype_name: "ridemountainpig",
        theme: "witch_girl",
        type: [""],
    },
    {
        monkeytype_name: "semi",
        theme: "blueberry_light",
        type: [""],
    },
    {
        monkeytype_name: "mac",
        theme: "mizu",
        type: ["lb"],
    },
    {
        monkeytype_name: "ze_or",
        theme: "darling",
        type: [""],
    },
    {
        monkeytype_name: "nask",
        theme: "beach",
        type: ["lb"],
    },
    {
        monkeytype_name: "davidho0403",
        theme: "lil_dragon",
        type: ["pb"],
    },
];

async function downloadImage(url) {
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
    });
    return response.data;
}

async function uploadImage(username, theme, type, authToken) {
    try {
        const imageUrl = `https://monkeytype-readme.zeabur.app/generate-svg/${username}/${theme}${
            type ? `?${type}=true` : ""
        }`;
        const imageStream = await downloadImage(imageUrl);
        const form = new FormData();

        const imageName = `${username}_${type != "" ? type + "_" : ""}${theme}`;
        form.append("monkeytype_name", imageName);
        form.append("mr_image", imageStream, { filename: `${imageName}.svg` });

        const finished = promisify(stream.finished);

        const uploadResponse = await axios.post(
            pbDomain + "api/collections/monkeytype_readme_image/records",
            form,
            {
                headers: {
                    Authorization: `${authToken}`,
                },
            },
        );

        await finished(imageStream);

        console.log("Upload successful:", uploadResponse.data);
        return true;
    } catch (error) {
        console.error("Error uploading image:", error);
        return false;
    }
}

async function deleteImage(imageId, authToken) {
    try {
        const deleteResponse = await axios.delete(
            pbDomain + `api/collections/monkeytype_readme_image/records/${imageId}`,
            {
                headers: {
                    Authorization: `${authToken}`,
                },
            },
        );

        console.log("Delete successful");
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
}

async function uploadImageToPB() {
    const authToken = await authenticate();
    if (!authToken) {
        console.error("Authentication failed. No token received.");
        return;
    }

    const pbData = await getImageDataFromPB();

    for (const image of imageData) {
        for (const type of image.type) {
            const result = await uploadImage(
                image.monkeytype_name,
                image.theme,
                type,
                authToken,
            );

            if (result == true) {
                for (const pbImage of pbData) {
                    if (
                        pbImage.monkeytype_name ===
                        `${image.monkeytype_name}_${type != "" ? type + "_" : ""}${
                            image.theme
                        }`
                    ) {
                        await deleteImage(pbImage.id, authToken);
                    }
                }
            }
        }
    }
}

async function getImageDataFromPB() {
    const authToken = await authenticate();

    const response = await axios.get(
        pbDomain + "api/collections/monkeytype_readme_image/records",
        {
            headers: {
                Authorization: `${authToken}`,
            },
        },
    );

    return response.data.items;
}

uploadImageToPB();

module.exports = {
    getImageDataFromPB,
    uploadImageToPB,
};
