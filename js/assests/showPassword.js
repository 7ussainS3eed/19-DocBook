let shows = $(".to-show");
let hides = $(".to-hide");
let passInputs = $("input[type=password]");
for (let i = 0; i < 3; i++) {
    shows[i].onclick = createClickHandler(i, "none", "flex", "text");
    hides[i].onclick = createClickHandler(i, "flex", "none", "password");
}
function createClickHandler(index, showDisplay, hideDisplay, inputType) {
    return function() {
        shows[index].style.display = showDisplay;
        hides[index].style.display = hideDisplay;
        passInputs[index].type = inputType;
    };
}