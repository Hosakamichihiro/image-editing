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

//---------------
//サイドバー
//---------------
function openFilter(name) {
    //サイドバーを閉じる
    document.getElementById("menu-toggle").checked = false;

    //全部閉じる
    var controls = document.querySelectorAll(".control");
    for (var i = 0; i < controls.length; i++) {
        controls[i].classList.remove("active");
    }

    //対象を開く
    var target = document.getElementById(name + "-control");
    if (target) {
        target.classList.add("active");

        //スクロール（UX向上）
        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}
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

var originalImage = null;
//---------------
//画像のアップロード
//---------------
var uploadMain = document.getElementById("upload-main");
var uploadSide = document.getElementById("upload-side");

uploadMain.addEventListener("change", loadImage);
uploadSide.addEventListener("change", loadImage);

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function loadImage(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };

        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
}

img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // 🔥 これが超重要
    originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

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

//-----
//トリミング
//-----
let startX, startY, endX, endY;
let isDragging = false;

canvas.addEventListener("mousedown", (e) => {
    startX = e.offsetX;
    startY = e.offsetY;
    isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    endX = e.offsetX;
    endY = e.offsetY;

    // プレビュー（四角）
    ctx.putImageData(originalImage, 0, 0);
    ctx.strokeStyle = "red";
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
});

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

function startCrop() {
    console.log("OK");
}
//
function crop() {
    const width = endX - startX;
    const height = endY - startY;

    const imageData = ctx.getImageData(startX, startY, width, height);

    canvas.width = width;
    canvas.height = height;

    ctx.putImageData(imageData, 0, 0);

    saveState();
}

//------------
//明るさ・コントラスト調節
//------------
const brightnessSlider = document.getElementById("brightness");//明るさ調整
const contrastSlider = document.getElementById("contrast");//コントラストの調整
const saturationSlider = document.getElementById("saturation");//彩度の調整
const blurSlider = document.getElementById("blur");//ぼかし


brightnessSlider.addEventListener("input", applyFilters);
contrastSlider.addEventListener("input", applyFilters);
saturationSlider.addEventListener("input", applyFilters);
blurSlider.addEventListener("input", applyFilters);

function applyFilters() {
    if (!originalImage) return;

    const brightness = parseInt(brightnessSlider.value);
    const contrast = parseInt(contrastSlider.value);
    const saturation = parseInt(saturationSlider.value) / 100;
    const blur = parseInt(blurSlider.value);
    //ctx.putImageData(originalImage, 0, 0);
    //一度Canvasをクリアして描画（ぼかし用）
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //blur適用（超簡単！）
    //ctx.filter = `blur(${blur}px)`;

    //元画像を描画
    //ctx.putImageData(originalImage, 0, 0);

    //フィルター解除（重要）

    ctx.filter = `blur(${blur}px)`;   // ←ここ！
    ctx.drawImage(imgElement, 0, 0);  // ←ここ！
    ctx.filter = "none";


    //ピクセル取得
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        // 明るさ
        let r = data[i] + brightness;
        let g = data[i + 1] + brightness;
        let b = data[i + 2] + brightness;

        // コントラスト
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;

        // ===== 彩度 =====
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }

    ctx.putImageData(imageData, 0, 0);

        //数値表示
    brightnessSlider.oninput = () => {
        document.getElementById("bVal").textContent = brightnessSlider.value;
        applyFilters();
    };
    contrastSlider.oninput = () => {
        document.getElementById("cVal").textContent = contrastSlider.value;
        applyFilters();
    };
    saturationSlider.oninput = () => {
        document.getElementById("sVal").textContent = saturationSlider.value;
        applyFilters();
    };
    blurSlider.oninput = () => {
        document.getElementById("blurVal").textContent = blurSlider.value;
        applyFilters();
    };
    //保存
    slider.addEventListener("change", saveState);
}

function updateDisplay() {
    document.getElementById("bVal").textContent = brightnessSlider.value;
    document.getElementById("cVal").textContent = contrastSlider.value;
    document.getElementById("sVal").textContent = saturationSlider.value;
    document.getElementById("blurVal").textContent = blurSlider.value;
}
//----------
//エッジ検出
//----------
function edgeDetect() {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var width = canvas.width;
    var height = canvas.height;

    var output = ctx.createImageData(width, height);
    var outData = output.data;

    // Sobelカーネル
    var gx = [-1, 0, 1,
              -2, 0, 2,
              -1, 0, 1];

    var gy = [-1, -2, -1,
               0,  0,  0,
               1,  2,  1];

    // グレースケール変換（事前）
    var gray = [];
    for (var i = 0; i < data.length; i += 4) {
        var g = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        gray.push(g);
    }

    // エッジ検出
    for (var y = 1; y < height - 1; y++) {
        for (var x = 1; x < width - 1; x++) {

            var sumX = 0;
            var sumY = 0;

            var index = 0;

            for (var ky = -1; ky <= 1; ky++) {
                for (var kx = -1; kx <= 1; kx++) {
                    var pixel = gray[(y + ky) * width + (x + kx)];

                    sumX += pixel * gx[index];
                    sumY += pixel * gy[index];

                    index++;
                }
            }

            var magnitude = Math.sqrt(sumX * sumX + sumY * sumY);

            var i = (y * width + x) * 4;

            outData[i] = magnitude;
            outData[i + 1] = magnitude;
            outData[i + 2] = magnitude;
            outData[i + 3] = 255;
        }
    }

    ctx.putImageData(output, 0, 0);
}

//保存
let history = [];
let historyIndex = -1;

function saveState() {
    // 現在のCanvasを保存
    const data = canvas.toDataURL();

    // 未来を削除（Redo対策）
    history = history.slice(0, historyIndex + 1);

    history.push(data);
    historyIndex++;
}

//-----
//Undo
//-----
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState();
    }
}
//-----
//Redo
//-----
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState();
    }
}
//-----
//復元
//-----
function restoreState() {
    const img = new Image();
    img.src = history[historyIndex];

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}
//リセット
function resetFilters() {
    if (!originalImage) return;

    brightnessSlider.value = 0;
    contrastSlider.value = 0;
    saturationSlider.value = 100;
    blurSlider.value = 0;

    updateDisplay();
    applyFilters();
/*
    if (!originalImage) return;

    brightnessSlider.value = 0;
    contrastSlider.value = 0;
    saturationSlider.value = 100;
    blurSlider.value = 0;

    // 表示も戻す
    document.getElementById("bVal").textContent = 0;
    document.getElementById("cVal").textContent = 0;
    document.getElementById("sVal").textContent = 100;
    document.getElementById("blurVal").textContent = 0;
    */
}

//------------
//全体のリセット
//------------
function resetImage() {
/*
    if (!originalImage) return;
*/
    ctx.putImageData(originalImage, 0, 0);

    if (originalImage) {
        ctx.putImageData(originalImage, 0, 0);
    }
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