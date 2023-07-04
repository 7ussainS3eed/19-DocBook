let sure = document.querySelector(".sure");
sure.innerHTML = (`
    <p>Are you sure you want to delete account?</p>
    <div>
        <button>Yes</button>
        <button>No</button>
    </div>
    <div class="spinner"></div>
`);

let over = document.querySelector(".over");
let clickToHide = Array.from([over, document.querySelector(".sure div button:last-of-type")]);
for (i = 0; i < 2; i++) {
    clickToHide[i].addEventListener("click", function() {
        sure.style.display = "none";
        over.style.display = "none";
        html.style.overflow = "auto";
    })
}