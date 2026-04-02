//----------
//保存
//----------
var history = [];
var historyIndex = -1;

function saveState() {
    var data = canvas.toDataURL();
    history = history.slice(0, historyIndex + 1);
    history.push(data);
    historyIndex++;
}
//----------
//Undo
//----------
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        restoreState();
    }
}

//----------
//Redo
//----------
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        restoreState();
    }
}

//----------
//復元
//----------
function restoreState() {
    var img = new Image();
    img.src = history[historyIndex];

    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}