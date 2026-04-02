//------------
//ヘッダー
//------------
var lastScrollY = window.scrollY;
var header = document.querySelector(".site-header");

window.addEventListener("scroll", function () {
    var currentScrollY = window.scrollY;

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
        target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}