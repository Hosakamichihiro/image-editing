//------------
//ヘッダー
//------------
let lastScrollY = window.scrollY;
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 50) {
        header.classList.remove("hide");
        return;
    }

    if (currentScrollY > lastScrollY) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScrollY = currentScrollY;
});





const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = null;

// 画像読み込み
upload.addEventListener("change", function () {
    const file = this.files[0];
    const img = new Image();

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    img.src = URL.createObjectURL(file);
});

// グレースケール
function grayscale() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = data[i+1] = data[i+2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
}

// リセット
function resetImage() {
    if (originalImage) {
        ctx.putImageData(originalImage, 0, 0);
    }
}

//ダウンロード
function downloadImage() {
    const canvas = document.getElementById("canvas");

    const link = document.createElement("a");
    const now = new Date();
    link.download = `image_${now.getTime()}.png`;
    link.href = canvas.toDataURL("image/png"); // 画像データ取得

    link.click();
}