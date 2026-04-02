var uploadMain = document.getElementById("upload-main");
var uploadSide = document.getElementById("upload-side");

if (uploadMain) uploadMain.addEventListener("change", loadImage);
if (uploadSide) uploadSide.addEventListener("change", loadImage);

//---------------
//フィルターの開閉
//---------------
document.querySelectorAll(".control-header").forEach(header => {
    header.addEventListener("click", () => {
        const parent = header.parentElement;

        document.querySelectorAll(".control").forEach(c => {
            if (c !== parent) c.classList.remove("active");
        });

        parent.classList.toggle("active");
    });
});

//------------
//全体のリセット
//------------
function resetImage() {
    if (!app.originalImage) return;
    app.ctx.putImageData(app.originalImage, 0, 0);
}

//------------
//ダウンロード
//------------
function downloadImage() {
    const canvas = document.getElementById("canvas");

    const link = document.createElement("a");
    const now = new Date();
    link.download = `image_${now.getTime()}.png`;
    link.href = canvas.toDataURL("image/png"); // 画像データ取得

    link.click();
}

//----------
//グローバル
//----------
window.app = {
    canvas: null,
    ctx: null,

    // 画像状態
    originalImage: null,
    imgElement: new Image(),
    // トリミング状態
    isDragging: false,
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
};
//----------
//canvas初期化
//----------
window.initApp = function () {
    app.canvas = document.getElementById("canvas");
    app.ctx = app.canvas.getContext("2d");
};