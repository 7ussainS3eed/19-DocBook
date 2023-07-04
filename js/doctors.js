let doctorsPreInfo = JSON.parse(localStorage.getItem("doctorsPreInfo"));
console.log(doctorsPreInfo)
var waitingOptions = [10, 15, 20, 25, 30];
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
            <p>${doctorsPreInfo[i].specialty ? doctorsPreInfo[i].specialty : "Specialty hasn’t been set yet!"}</p>
            <div class="count">
                <div>
                    ${doctorsPreInfo[i].raiting != 0 ? `<img src="./images/rate.png"><span>${doctorsPreInfo[i].raiting.toFixed(1)}</span>` : `<span>No Ratings Yet!</span>`}
                </div>
                <!--<div>
                    <img src="./images/view.png"><span></span>
                </div>-->
            </div>
            <div class="information">
                <div>
                    <img src="./images/time.png"><span>Waiting Time</span><span>${waitingOptions[Math.floor(Math.random() * waitingOptions.length)]} Minute</span>
                </div>
                <!--<div>
                    <img src="./images/dolar.png"><span>Detection price</span><span>pounds</span>
                </div>-->
                <div>
                    <img src="./images/video3.png"><span>Video Calls</span><span>${Math.floor(Math.random() * 3)} Call</span>
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
        </div>
    `);
    boxes.appendChild(box);
}
for (i = 0; i < doctorsPreInfo.length; i++) {
    renderDoctors();
}

let times = ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"];
let prefinalResult = "";
let renderDropMenus = function() {
    function getRandomDuration() {
        const durations = ["30 min", "1 hr"];
        return durations[Math.floor(Math.random() * durations.length)];
    }
    function getRandomTakenArray() {
        const length = Math.floor(Math.random() * 4) + 3;
        const taken = new Set();
        while (taken.size < length) {
          taken.add(Math.floor(Math.random() * 16));
        }
        return Array.from(taken);
    }
    function generateObjectsArray(length) {
        const objectsArray = [];
        for (let z = 0; z < length; z++) {
            const obj = {
                duration: getRandomDuration(),
                taken: getRandomTakenArray(),
        };
            objectsArray.push(obj);
        }
        return objectsArray;
    }
    const doctors = generateObjectsArray(doctorsPreInfo.length);
    let boxesButtons = document.querySelectorAll(".parent .content .boxes .box .first button");
    let informationDivs = document.querySelectorAll(".parent .content .boxes .box .first .information");
    let dropMenus = document.querySelectorAll(".wrapper .dropMenu");
    for (b = 0; b < 16; b++) {
        let time = document.createElement("span")
        if (doctors[j].duration == "1 hr" && b%2!=0) {
            time.classList.add("duration");
        }
        for (c = 0; c < doctors[j].taken.length; c++) {
            if (b == doctors[j].taken[c]) {
                time.classList.add("cannot");
            }
        }
        time.innerHTML = times[b]
        time.onclick = function() {
            if (time.classList.contains("duration") == 0 && time.classList.contains("cannot") == 0) {
                boxesButtons[boxIndex].style.display = "block"
                boxesButtons[boxIndex].innerHTML = (`
                    Book (${prefinalResult} at ${this.innerHTML})
                `)
                informationDivs[boxIndex].style.marginBottom = "10px"
                $(boxesButtons[boxIndex]).addClass("fade-in")
                setTimeout(() => {
                    $(boxesButtons[boxIndex]).removeClass("fade-in")
                }, 1000)
                localStorage.setItem("dateAndTimePicked", `${prefinalResult} at ${this.innerHTML}`)
            }
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