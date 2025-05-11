let monkeytypeName = "";
let leaderBoardBtnState = false;
let personalBestBtnState = false;
let themeListState = {
    themeName: "",
    borderColor: "",
};

$("#createNowBtn").click(function () {
    let targetElement = $("#mr-introduce");
    $("html, body").animate(
        {
            scrollTop: targetElement.offset().top,
        },
        800,
    );
});

$("#monkeytypeNameInput").on("input", function () {
    monkeytypeName = $(this).val();
});

$("#leaderBoardBtn").click(function () {
    initialReadmeBtn("#leaderBoardBtn", leaderBoardBtnState);
    leaderBoardBtnState = !leaderBoardBtnState;
});

$("#personalBestBtn").click(function () {
    initialReadmeBtn("#personalBestBtn", personalBestBtnState);
    personalBestBtnState = !personalBestBtnState;
});

$("#generateReadmeBtn").click(async function () {
    $("#monkeytypeNameError").addClass("absolute hidden");
    $("#themeNameError").addClass("absolute hidden");
    $("#monkeytypeNameInvalidError").addClass("absolute hidden");

    let svgDataCheck = false;
    const VALID_NAME_PATTERN = /^[\da-zA-Z_.-]+$/;

    if (monkeytypeName === "") {
        $("#monkeytypeNameError").removeClass("absolute hidden");
        svgDataCheck = true;
    }

    if (themeListState.themeName === "") {
        $("#themeNameError").removeClass("absolute hidden");
        svgDataCheck = true;
    }

    if (
        monkeytypeName !== "" &&
        (!VALID_NAME_PATTERN.test(monkeytypeName) ||
            !(monkeytypeName.length > 1 && monkeytypeName.length < 16))
    ) {
        $("#monkeytypeNameInvalidError").removeClass("absolute hidden");
        svgDataCheck = true;
    }

    if (svgDataCheck) {
        return;
    }

    $("#generateReadmeBtn").prop("disabled", true);
    $("#generateReadmeBtn").addClass("cursor-not-allowed");
    $("#generateReadmeBtn").removeClass(
        "hover:bg-nord-light-green hover:text-nord-light-bg hover:opacity-60",
    );
    $("#generateReadmeBtnLoad").removeClass("hidden");
    $("#generateReadmeBtnText").text("Monkeytype Readme Generating...");

    let themeList = await getMonkeyTypeThemesList();
    let themeData = {};

    for (let i = 0; i < themeList.length; i++) {
        if (themeListState.themeName === themeList[i]["name"]) {
            themeData = themeList[i];
            break;
        }
    }

    let personalReadmeUrl = `${domain}/${monkeytypeName}/${themeListState.themeName}`;
    let personalReadmeBtnStyle = `color: ${themeData["mainColor"]}; background-color: ${themeData["bgColor"]}; outline-color: ${themeData["mainColor"]};"`;

    let url = `${domain}/generate-svg/${monkeytypeName}/${themeListState.themeName}`;
    if (leaderBoardBtnState && personalBestBtnState) {
        url += "?lbpb=true";
    } else {
        if (leaderBoardBtnState) {
            url += "?lb=true";
        }
        if (personalBestBtnState) {
            url += "?pb=true";
        }
    }

    const img = new Image();

    img.src = url;

    img.onload = function () {
        $("#previewReadmeLink").attr(
            "href",
            `https://monkeytype.com/profile/${monkeytypeName}`,
        );
        $("#previewReadmeImg").attr("src", url);
        $("#previewReadmeImg").attr(
            "alt",
            monkeytypeName + " | Monkeytype Readme",
        );

        $("#personalReadmeLink").attr("href", personalReadmeUrl);
        $("#personalReadmeLink").attr(
            "title",
            `${monkeytypeName} | Monkeytype Readme`,
        );
        $("#personalReadmeBtn").attr("style", personalReadmeBtnStyle);

        updateReadmeCode();

        $("#generateReadmeBtn").prop("disabled", false);
        $("#generateReadmeBtn").removeClass("cursor-not-allowed");
        $("#generateReadmeBtn").addClass(
            "hover:bg-nord-light-green hover:text-nord-light-bg hover:opacity-60",
        );

        $("#personalReadmeBtn").removeClass("hidden");

        $("#generateReadmeBtnLoad").addClass("hidden");
        $("#generateReadmeBtnText").text("Generate Monkeytype Readme");
    };
});

$("#monkeytypeNameError").mouseenter(function () {
    $("#monkeytypeNameErrorHover").removeClass("hidden");
});

$("#monkeytypeNameError").mouseleave(function () {
    $("#monkeytypeNameErrorHover").addClass("hidden");
});

$("#themeNameError").mouseenter(function () {
    $("#themeNameErrorHover").removeClass("hidden");
});

$("#themeNameError").mouseleave(function () {
    $("#themeNameErrorHover").addClass("hidden");
});

$("#monkeytypeNameInvalidError").mouseenter(function () {
    $("#monkeytypeNameInvalidErrorHover").removeClass("hidden");
});

$("#monkeytypeNameInvalidError").mouseleave(function () {
    $("#monkeytypeNameInvalidErrorHover").addClass("hidden");
});

function errorHoverClick(id) {
    $(`#${id}`).addClass("hidden");
}

function initialReadmeBtn(buttonId, buttonState) {
    if (!buttonState) {
        $(buttonId).removeClass("bg-slate-100 text-gray-400");
        $(buttonId).addClass(
            "bg-nord-light-green text-nord-light-bg opacity-60",
        );
    } else {
        $(buttonId).removeClass(
            "bg-nord-light-green text-nord-light-bg opacity-60",
        );
        $(buttonId).addClass("bg-slate-100 text-gray-400");
    }
}

function showThemeList() {
    $("#showThemeBtn").addClass("hidden");
    $("#themeListContainer").removeClass("h-96");
    $("#hideThemeBtn").removeClass("hidden");
}

function hideThemeList() {
    let targetElement = $("#mr-create");
    $("html, body").animate(
        {
            scrollTop: targetElement.offset().top,
        },
        800,
    );
    setTimeout(() => {
        $("#showThemeBtn").removeClass("hidden");
        $("#themeListContainer").addClass("h-96");
        $("#hideThemeBtn").addClass("hidden");
    }, 800);
}

function showBorder(themeName) {
    const borderColor = $(`#${themeName}`).css("border-color");
    if (themeName === themeListState.themeName) {
        $(`#${themeName}`).css("border", "");
        $(`#${themeName}`).css("border-color", themeListState.borderColor);
        themeListState.themeName = "";
    } else {
        if (themeListState.themeName !== "") {
            $(`#${themeListState.themeName}`).css("border", "");
            $(`#${themeListState.themeName}`).css(
                "border-color",
                themeListState.borderColor,
            );
        }
        $(`#${themeName}`).css("border", `4px solid ${borderColor}`);
        themeListState.themeName = themeName;
        themeListState.borderColor = borderColor;
    }
}

function updateReadmeCode() {
    const githubReamdeYml = `
    <pre class="rounded-xl line-numbers language-yaml" tabindex="0">                        <code class="language-yaml">
    <span class="token key atrule">name</span><span class="token punctuation">:</span> generate monkeytype readme svg
    
    <span class="token key atrule">on</span><span class="token punctuation">:</span>
    <span class="token key atrule">schedule</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">cron</span><span class="token punctuation">:</span> <span class="token string">"0 */6 * * *"</span> <span class="token comment"># every 6 hours</span>
    <span class="token key atrule">workflow_dispatch</span><span class="token punctuation">:</span>
    
    <span class="token key atrule">jobs</span><span class="token punctuation">:</span>
    <span class="token key atrule">download-svg</span><span class="token punctuation">:</span>
        <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest
        <span class="token key atrule">steps</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Checkout code
            <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v3
    
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Set up Node.js
            <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/setup<span class="token punctuation">-</span>node@v3
            <span class="token key atrule">with</span><span class="token punctuation">:</span>
            <span class="token key atrule">node-version</span><span class="token punctuation">:</span> <span class="token string">'16.x'</span>
    
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Download SVG
            <span class="token key atrule">run</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
            mkdir public
            curl -o public/monkeytype-readme.svg ${domain}/generate-svg/${monkeytypeName}/${themeListState.themeName}
            curl -o public/monkeytype-readme-lb.svg ${domain}/generate-svg/${monkeytypeName}/${themeListState.themeName}?lb=true
            curl -o public/monkeytype-readme-pb.svg ${domain}/generate-svg/${monkeytypeName}/${themeListState.themeName}?pb=true
            curl -o public/monkeytype-readme-lb-pb.svg ${domain}/generate-svg/${monkeytypeName}/${themeListState.themeName}?lbpb=true</span>
    
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> push monkeytype<span class="token punctuation">-</span>readme.svg to the monkeytype<span class="token punctuation">-</span>readme branch
            <span class="token key atrule">uses</span><span class="token punctuation">:</span> crazy<span class="token punctuation">-</span>max/ghaction<span class="token punctuation">-</span>github<span class="token punctuation">-</span>pages@v2.5.0
            <span class="token key atrule">with</span><span class="token punctuation">:</span>
            <span class="token key atrule">target_branch</span><span class="token punctuation">:</span> monkeytype<span class="token punctuation">-</span>readme
            <span class="token key atrule">build_dir</span><span class="token punctuation">:</span> public
            <span class="token key atrule">env</span><span class="token punctuation">:</span>
            <span class="token key atrule">GITHUB_TOKEN</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span><span class="token punctuation">{</span> secrets.GITHUB_TOKEN <span class="token punctuation">}</span><span class="token punctuation">}</span>
                <span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code>
                    </pre>
    `;
    $("#githubReadmeYml").empty();
    $("#githubReadmeYml").append(githubReamdeYml);

    const githubReamdeMd = `
    <pre class="rounded-xl line-numbers language-css" tabindex="0">                        <code class="language-css">
    &lt;a href=<span class="token string">"https://monkeytype.com/profile/${monkeytypeName}"</span>&gt;
        &lt;img src=<span class="token string">"https://raw.githubusercontent.com/GITHUB_USERNAME/GITHUB_REPOSITORY/monkeytype-readme/monkeytype-readme-lb.svg"</span> alt=<span class="token string">"My Monkeytype profile"</span> /&gt;
    &lt;/a&gt;
                        <span aria-hidden="true" class="line-numbers-rows"><span></span><span></span><span></span><span></span><span></span></span></code>
                    </pre>
    `;
    $("#githubReadmeMd").empty();
    $("#githubReadmeMd").append(githubReamdeMd);
}

function hexToRgb(hex) {
    // Remove the # symbol if present
    hex = hex.replace("#", "");

    // Check if the hex code is three characters long
    if (hex.length === 3) {
        // Duplicate each character to expand the code to six characters
        hex = hex.replace(/(.)/g, "$1$1");
    }

    // Convert the hex value to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

function compareColors(hex1, hex2, themeName1, themeName2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const brightness1 = rgb1.r + rgb1.g + rgb1.b;
    const brightness2 = rgb2.r + rgb2.g + rgb2.b;

    if (brightness1 > brightness2) {
        return true;
    } else if (brightness1 == brightness2) {
        if (themeName1 < themeName2) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function getMonkeyTypeThemesList() {
    const url =
        "https://raw.githubusercontent.com/monkeytype-hub/monkeytype-readme/refs/heads/master/monkeytype-data/themes.json";

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}

async function themeList() {
    let themeList = await getMonkeyTypeThemesList();

    for (let i = 0; i < themeList.length; i++) {
        for (let j = i + 1; j < themeList.length; j++) {
            if (
                compareColors(
                    themeList[i]["bgColor"],
                    themeList[j]["bgColor"],
                    themeList[i]["name"],
                    themeList[j]["name"],
                )
            ) {
                let temp = themeList[i];
                themeList[i] = themeList[j];
                themeList[j] = temp;
            }
        }
    }

    for (let i = themeList.length - 1; i >= 0; i--) {
        let html = `
        <button id="${
            themeList[i]["name"]
        }" class="theme-border col-span-1 rounded-xl px-2 py-3 h-12"
            style="background-color: ${
                themeList[i]["bgColor"]
            }; border-color: ${themeList[i]["mainColor"]};"
            onclick="showBorder('${themeList[i]["name"]}')">
            <div class="col-span-5 flex justify-center items-center tracking-wider font-medium h-full"
                style="color: ${themeList[i]["mainColor"]};">${themeList[i][
                    "name"
                ].replace(/_/g, " ")}</div>
        </button>
        `;
        $("#themeListContainer").append(html);
    }
}

themeList();
