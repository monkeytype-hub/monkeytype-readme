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

function hexToRgb(hex) {
    // Remove the # symbol if present
    hex = hex.replace('#', '');

    // Convert the hex value to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

function getBrightness(rgb) {
    // Calculate the brightness value using the formula
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
}

function compareColors(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const brightness1 = getBrightness(rgb1);
    const brightness2 = getBrightness(rgb2);

    if (brightness1 > brightness2) {
        return true;
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
            if (compareColors(themeList[i]["bgColor"], themeList[j]["bgColor"])) {
                let temp = themeList[i];
                themeList[i] = themeList[j];
                themeList[j] = temp;
            }
        }
    }

    for (let i = themeList.length - 1; i >= 0; i--) {
        let html = `
            <div class="theme-border col-span-1 rounded-xl px-2 py-3 h-12" style="background-color: ${themeList[i]["bgColor"]}; border-color: ${themeList[i]["mainColor"]};">
                <div class="col-span-5 flex justify-center items-center tracking-wider font-medium h-full" style="color: ${themeList[i]["mainColor"]};">${themeList[i]["name"].replace(/_/g, ' ')}</div>
            </div>
        `
        $('#themeListContainer').append(html);
    }
}

themeList();