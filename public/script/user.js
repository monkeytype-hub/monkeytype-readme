let shareListState = false;

$("#shareBtn").click(function () {
    if (!shareListState) {
        $("#shareList").removeClass("hidden");
        shareListState = true;
    } else {
        $("#shareList").addClass("hidden");
        shareListState = false;
    }
});

$(document).click(function (event) {
    if (
        !$(event.target).closest(
            "#shareTwitterBtn, #shareFacebookBtn, #shareUrlBtn, #shareBtn",
        ).length &&
        shareListState == true
    ) {
        $("#shareList").addClass("hidden");
        shareListState = false;
    }
});

async function copyReadmeUrl(copyUrl) {
    await navigator.clipboard.writeText(copyUrl);
}
