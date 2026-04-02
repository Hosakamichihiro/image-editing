function loadImage(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.onload = function (event) {
        app.imgElement.onload = function () {
            app.canvas.width = app.imgElement.width;
            app.canvas.height = app.imgElement.height;

            app.ctx.drawImage(app.imgElement, 0, 0);

            app.originalImage = app.ctx.getImageData(
                0,
                0,
                app.canvas.width,
                app.canvas.height
            );
        };

        app.imgElement.src = event.target.result;
    };

    reader.readAsDataURL(file);
}
