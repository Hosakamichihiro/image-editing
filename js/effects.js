//----------
//グレースケール
//----------
function grayscale() {
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] = data[i+1] = data[i+2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
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