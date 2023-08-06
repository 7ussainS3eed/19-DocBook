document.querySelector(".back").onclick = () => location.href = "index.html";

let doctorsPreInfo = JSON.parse(localStorage.getItem("doctorsPreInfo"));
let boxes = document.querySelector(".parent .content .boxes");
let renderDoctors = function() {
    let box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = (`
        <div class="first">
            <img src=${doctorsPreInfo[i].photo} class="profile">
            <aside>
                <i class="fa fa-address-card"></i>
            </aside>
            <h5>Dr. ${doctorsPreInfo[i].userName}</h5>
            <p>${doctorsPreInfo[i].specialty ? doctorsPreInfo[i].specialty : "Cardiology (Heart)"}</p>
            <div class="count">
                <div>
                    ${doctorsPreInfo[i].raiting != 0 ? `<i class="fa-solid fa-star"></i></i><span>${doctorsPreInfo[i].raiting.toFixed(1)}</span>` : `<span>No Ratings Yet!</span>`}
                </div>
            </div>
            <div class="information">
                <div>
                    <i class="fa-solid fa-star"></i></i><span>Reviews</span><span>${doctorsPreInfo[i].numReviews} Review</span>
                </div>
                <div>
                    <i class="fa-solid fa-money-check-dollar"></i><span>Detection Price</span><span>${doctorsPreInfo[i].price}$</span>
                </div>
            </div>
            <button></button>
            <div class="spinner"></div>
        </div>
        <div class="second">
            <div class="wrapper">
                <header></header>
                <div class="calendar"></div>
                <div class="dropMenu"></div>
            </div>
            <div class="spinner"></div>
        </div>
    `);
    boxes.appendChild(box);
}
for (i = 0; i < doctorsPreInfo.length; i++) {
    renderDoctors();
}

let times = ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];
let prefinalResult = "";
let renderDropMenus = function() {
    let checkingSpinner = document.querySelectorAll(".parent .content .boxes .box .second .spinner");
    let boxesButtons = document.querySelectorAll(".parent .content .boxes .box .first button");
    let dropMenus = document.querySelectorAll(".wrapper .dropMenu");
    for (b = 0; b < 8; b++) {
        let time = document.createElement("span")
        time.innerHTML = times[b]
        time.onclick = function() {
            bookButtons[boxIndex].style.display = "none";
            checkingSpinner[boxIndex].style.display = "block";
            var inputDate = prefinalResult;
            var dateObj = new Date(inputDate);
            var year = dateObj.getFullYear();
            var month = String(dateObj.getMonth() + 1).padStart(2, '0');
            var day = String(dateObj.getDate()).padStart(2, '0');
            var formattedDate = year + '-' + month + '-' + day;
            var inputTime = this.innerHTML;
            var timeParts = inputTime.split(':');
            var hours = parseInt(timeParts[0], 10);
            var minutes = timeParts[1].split(' ')[0];
            var meridian = 'pm';
            var formattedTime = hours + ':' + minutes + ' ' + meridian;
            fetch(`${domain}/doctor/getResrvationDays/${doctorsPreInfo[boxIndex]._id}/time/${formattedDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("patientMainData")).token}`,
                },
            })
            .then(response => response.json())
            .then(alldaychoosenAppons => {
                let flag = 0;
                for (i = 0; i < alldaychoosenAppons.length; i++) {
                    if (formattedTime == alldaychoosenAppons[i].start) {
                        flag = 1;
                        checkingSpinner[boxIndex].style.display = "none";
                        swal("This time is reserved, try to pick onother one!")
                        .then(() => {
                            location.reload();
                        });
                    }
                }
                if (flag == 0) {
                    checkingSpinner[boxIndex].style.display = "none";
                    boxesButtons[boxIndex].style.display = "block";
                    boxesButtons[boxIndex].innerHTML = (`
                        Book (${prefinalResult} at ${this.innerHTML})
                    `)
                    $(boxesButtons[boxIndex]).addClass("fade-in")
                    setTimeout(() => {
                        $(boxesButtons[boxIndex]).removeClass("fade-in")
                    }, 1000)
                    localStorage.setItem("dateAndTimePicked", `${prefinalResult} at ${this.innerHTML}`)
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
        dropMenus[j].appendChild(time);
    }
}
for (j = 0; j < doctorsPreInfo.length; j++) {
    renderDropMenus()
};

//handeling everything about choose speciality box
let chooseMenuOpened = 0
let chooseMenu = document.querySelector(".parent .content .bar form .choose .choose-menu");
let handelOpenAndClose = function(toBe) {
    if (toBe == 1) {
        chooseMenuOpened = 1;
        chooseMenu.style.display = "block";
    }
    else {
        chooseMenuOpened = 0;
        chooseMenu.style.display = "none";
    }
}
document.querySelector(".parent .content .bar form .choose").onclick = (e) => chooseMenuOpened == 0 ? handelOpenAndClose(1) : chooseMenuOpened == 1 && !e.target.classList.contains("choose-menu") ? handelOpenAndClose(0) : null;
document.querySelector("body").addEventListener("click", (e) => chooseMenuOpened == 1 && !e.target.classList.contains("to-handel") && !e.target.classList.contains("choose-menu") ? handelOpenAndClose(0) : null)
let showHere = document.querySelector(".parent .content .bar form .choose .shown-here");
let reset = document.querySelector(".parent .content .bar form aside");
for (i = 0; i < 6; i++) {
    document.querySelectorAll(".parent .content .bar form .choose .choose-menu .choose-li")[i].onclick = (e) => {
        showHere.innerHTML = e.target.innerHTML;
        reset.style.display = "block";
    }
}

reset.onclick = () => location.reload();

//handeling what will happen when the big box of search clicked
let doctorNameInput = document.querySelector(".parent .content .bar form div:nth-of-type(2) div input");
document.querySelector(".parent .content .bar form div:nth-of-type(2)").onclick = () => doctorNameInput.focus();

let viewProfAsid = document.querySelectorAll(".parent .content .boxes .box .first aside");
for (i = 0; i < viewProfAsid.length; i++) {
    viewProfAsid[i].addEventListener("click", function() {
        localStorage.setItem("doctorOpenedId", doctorsPreInfo[Array.prototype.indexOf.call(viewProfAsid, this)]._id);
        localStorage.setItem("doctorOpenedProfFrom", "doctors.html")
        location.href = "docProfForPatient.html";
    })  
}

let bookButtons = document.querySelectorAll(".parent .content .boxes .box .first button");
for (i = 0; i < bookButtons.length; i++) {
    bookButtons[i].addEventListener("click", function() {
        let index = Array.prototype.indexOf.call(bookButtons, this);
        document.querySelectorAll(".parent .content .boxes .box .first .spinner")[index].style.display = "block";
        localStorage.setItem("doctorOpenedId", doctorsPreInfo[index]._id);        
        fetch(`${domain}/doctor/account/profile/${doctorsPreInfo[index]._id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("patientMainData")).token}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("doctorOpenedFullData", JSON.stringify(data));
            location.href = "confirm.html"
        })
        .catch(error => {
            console.error(error);
        });
    })
}