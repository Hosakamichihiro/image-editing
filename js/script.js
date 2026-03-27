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




const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let originalImage = null;
let imgElement = new Image();
// 画像読み込み
upload.addEventListener("change", function () {
    const file = this.files[0];

    imgElement.onload = function () {
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0);

        originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };

    imgElement.src = URL.createObjectURL(file);
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
}

function updateDisplay() {
    document.getElementById("bVal").textContent = brightnessSlider.value;
    document.getElementById("cVal").textContent = contrastSlider.value;
    document.getElementById("sVal").textContent = saturationSlider.value;
    document.getElementById("blurVal").textContent = blurSlider.value;
}
//リセット
function resetFilters() {
    brightnessSlider.value = 0;
    contrastSlider.value = 0;
    saturationSlider.value = 100;
    blurSlider.value = 0;

    updateDisplay();
    applyFilters();
}

//------------
//全体のリセット
//------------
function resetImage() {
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