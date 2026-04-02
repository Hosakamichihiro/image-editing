window.addEventListener("DOMContentLoaded", () => {
    const canvas = app.canvas;
    const ctx = app.ctx;

    canvas.addEventListener("mousedown", function (e) {
        app.startX = e.offsetX;
        app.startY = e.offsetY;
        app.isDragging = true;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (!app.isDragging) return;

        app.endX = e.offsetX;
        app.endY = e.offsetY;

        ctx.putImageData(app.originalImage, 0, 0);
        ctx.strokeStyle = "red";
        ctx.strokeRect(
            app.startX,
            app.startY,
            app.endX - app.startX,
            app.endY - app.startY
        );
    });

    canvas.addEventListener("mouseup", function () {
        app.isDragging = false;
    });
});


window.startCrop = function () {
    const { ctx, canvas } = app;
    app.originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

window.crop = function () {
    const { ctx } = app;

    const width = app.endX - app.startX;
    const height = app.endY - app.startY;

    const imageData = ctx.getImageData(
        app.startX,
        app.startY,
        width,
        height
    );

    app.canvas.width = width;
    app.canvas.height = height;

    ctx.putImageData(imageData, 0, 0);
};

