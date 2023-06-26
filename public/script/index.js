let leaderBoardBtnState = false;
let personalBestBtnState = false;
let themeListState = {
    themeName: '',
    borderColor: ''
};

$('#leaderBoardBtn').mouseenter(function () {
    $('#leaderBoardTooltip').removeClass('hidden');
});

$('#leaderBoardBtn').mouseleave(function () {
    $('#leaderBoardTooltip').addClass('hidden');
});

$('#leaderBoardBtn').click(function () {
    initialReadmeBtn('#leaderBoardBtn', leaderBoardBtnState);
    leaderBoardBtnState = !leaderBoardBtnState;
});

$('#personalBestBtn').click(function () {
    initialReadmeBtn('#personalBestBtn', personalBestBtnState);
    personalBestBtnState = !personalBestBtnState;
});

function initialReadmeBtn(buttonId, buttonState) {
    if (!buttonState) {
        $(buttonId).removeClass('bg-slate-100 text-gray-400');
        $(buttonId).addClass('bg-nord-light-green text-nord-light-bg');
    } else {
        $(buttonId).removeClass('bg-nord-light-green text-nord-light-bg');
        $(buttonId).addClass('bg-slate-100 text-gray-400');
    }
}

$('#personalBestBtn').mouseenter(function () {
    $('#personalBestTooltip').removeClass('hidden');
});

$('#personalBestBtn').mouseleave(function () {
    $('#personalBestTooltip').addClass('hidden');
});

function showThemeList() {
    $('#showThemeBtn').addClass('hidden');
    $('#themeListContainer').removeClass('h-96');
    $('#hideThemeBtn').removeClass('hidden');
}

function hideThemeList() {
    $('#showThemeBtn').removeClass('hidden');
    $('#themeListContainer').addClass('h-96');
    $('#hideThemeBtn').addClass('hidden');
}

function showBorder(themeName) {
    const borderColor = $(`#${themeName}`).css('border-color');
    if (themeName === themeListState.themeName) {
        $(`#${themeName}`).css('border', '');
        $(`#${themeName}`).css('border-color', themeListState.borderColor);
        themeListState.themeName = '';
    } else {
        if (themeListState.themeName !== '') {
            $(`#${themeListState.themeName}`).css('border', '');
            $(`#${themeListState.themeName}`).css('border-color', themeListState.borderColor);
        }
        $(`#${themeName}`).css('border', `4px solid ${borderColor}`);
        themeListState.themeName = themeName;
        themeListState.borderColor = borderColor;
    }
}

function hexToRgb(hex) {
    // Remove the # symbol if present
    hex = hex.replace('#', '');

    // Check if the hex code is three characters long
    if (hex.length === 3) {
        // Duplicate each character to expand the code to six characters
        hex = hex.replace(/(.)/g, '$1$1');
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
    const url = 'https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/themes/_list.json';

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            return data;
        }
        );
}

async function themeList() {
    let themeList = await getMonkeyTypeThemesList();

    for (let i = 0; i < themeList.length; i++) {
        for (let j = i + 1; j < themeList.length; j++) {
            if (compareColors(themeList[i]["bgColor"], themeList[j]["bgColor"], themeList[i]["name"], themeList[j]["name"])) {
                let temp = themeList[i];
                themeList[i] = themeList[j];
                themeList[j] = temp;
            }
        }
    }

    for (let i = themeList.length - 1; i >= 0; i--) {
        let html = `
        <div id="${themeList[i]["name"]}" class="theme-border col-span-1 rounded-xl px-2 py-3 h-12"
            style="background-color: ${themeList[i]["bgColor"]}; border-color: ${themeList[i]["mainColor"]};"
            onclick="showBorder('${themeList[i]["name"]}')">
            <div class="col-span-5 flex justify-center items-center tracking-wider font-medium h-full"
                style="color: ${themeList[i]["mainColor"]};">${themeList[i]["name"].replace(/_/g, ' ')}</div>
        </div>
        `
        $('#themeListContainer').append(html);
    }
}

themeList();