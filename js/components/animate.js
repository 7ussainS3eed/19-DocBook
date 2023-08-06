let imagesSrcs = ["../images/animate.gif", "../images/animate2.gif", "../images/animate3.gif"];
let imageEle = document.querySelector(".animate");
let randomNumber = Math.floor(Math.random() * 5);
let imageIndex;
if (randomNumber < 3) {
    imageIndex = 0;
} else if (randomNumber < 4) {
    imageIndex = 1;
} else {
    imageIndex = 2;
}
imageEle.src = imagesSrcs[imageIndex];
if (imageIndex == 0) {
    imageEle.style.transform = "scaleX(-1)";
} else {
    imageEle.style.transform = "none";
}

document.querySelector(".exit").onclick = function() {
    this.style.display = "none";
    imageEle.style.display = "none";
}