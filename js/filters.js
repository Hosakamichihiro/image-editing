//------------
//明るさ・コントラスト・彩度・ぼかし
//------------
var brightnessSlider = document.getElementById("brightness");
var contrastSlider = document.getElementById("contrast");
var saturationSlider = document.getElementById("saturation");
var blurSlider = document.getElementById("blur");

brightnessSlider.addEventListener("input", applyFilters);
contrastSlider.addEventListener("input", applyFilters);
saturationSlider.addEventListener("input", applyFilters);
blurSlider.addEventListener("input", applyFilters);

function applyFilters() {
    if (!originalImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.filter = "blur(" + blurSlider.value + "px)";
    ctx.drawImage(imgElement, 0, 0);
    ctx.filter = "none";
    //ピクセル取得
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    var brightness = parseInt(brightnessSlider.value);
    var contrast = parseInt(contrastSlider.value);
    var saturation = parseInt(saturationSlider.value) / 100;

    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (var i = 0; i < data.length; i += 4) {
        //明るさ
        var r = data[i] + brightness;
        var g = data[i + 1] + brightness;
        var b = data[i + 2] + brightness;
        //コントラスト
        r = factor * (r - 128) + 128;
        g = factor * (g - 128) + 128;
        b = factor * (b - 128) + 128;
        //彩度
        var gray = 0.299 * r + 0.587 * g + 0.114 * b;

        data[i] = gray + (r - gray) * saturation;
        data[i + 1] = gray + (g - gray) * saturation;
        data[i + 2] = gray + (b - gray) * saturation;
    }

    ctx.putImageData(imageData, 0, 0);
}


function updateDisplay() {
    document.getElementById("bVal").textContent = brightnessSlider.value;
    document.getElementById("cVal").textContent = contrastSlider.value;
    document.getElementById("sVal").textContent = saturationSlider.value;
    document.getElementById("blurVal").textContent = blurSlider.value;
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