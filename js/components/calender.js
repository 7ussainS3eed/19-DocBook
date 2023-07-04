let boxIndex = 0;
let allRendering = function() {
    let wrappers = document.querySelectorAll(".wrapper");
    let headers = document.querySelectorAll(".wrapper header");
    let calendars = document.querySelectorAll(".wrapper .calendar");
    for (a = 0; a < wrappers.length; a++) {
        headers[a].innerHTML = (`
            <p class="current-date"></p>
            <div class="icons">
                <img src="./images/prev.png">
                <img src="./images/next.png">
            </div>
        `);
        calendars[a].innerHTML = (`
            <ul class="weeks">
                <li>S</li>
                <li>M</li>
                <li>T</li>
                <li>W</li>
                <li>T</li>
                <li>F</li>
                <li>S</li>
            </ul>
            <ul class="days ${a}"></ul>
        `);
    };
    const currentDates = document.querySelectorAll(".wrapper header .current-date");
    let date = new Date();
    let currMonths = [];
    let currYears = [];
    for (a = 0; a < currentDates.length; a++) {
        currMonths.push(date.getMonth());
        currYears.push(date.getFullYear());
    }
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysTags = document.querySelectorAll(".wrapper .calendar .days");
    let drops = document.querySelectorAll(".wrapper div + div");
    let reset = function(smaller) {
        for (i = 0; i < smaller.length; i++) {
            for (j = 0; j < daysTags[i].children.length; j++) {
                daysTags[i].children[j].style.border = "none";
                daysTags[i].children[j].classList.remove("openedNow");
            }
            drops[i].style.display = "none";
        }
    }
    let openedDrop = 0;
    const renderCalendar = () => {
        for (a = 0; a < currentDates.length; a++) {
            currentDates[a].innerText = `${months[currMonths[a]]} ${currYears[a]}`;
            let firstDayofMonth = new Date(currYears[a], currMonths[a], 1).getDay();
            let liTags = "";
            let lastDateofPrevMonth = new Date(currYears[a], currMonths[a], 0).getDate();
            for (b = firstDayofMonth; b > 0; b--) {
                liTags += `<li class="main notmonth">${lastDateofPrevMonth - b + 1}</li>`;
            }
            let lastDateofMonth = new Date(currYears[a], currMonths[a] + 1, 0).getDate();
            for (b = 1; b <= lastDateofMonth; b++) {
                let isNotFutur = new Date(`${currMonths[a]+1}-${b}-${currYears[a]}`) <= new Date(`${new Date().getMonth()+1}-${date.getDate()}-${new Date().getFullYear()}`) ? "prev" : ""
                let isToday = b === date.getDate() && currMonths[a] === new Date().getMonth() && currYears[a] === new Date().getFullYear() ? "active" : "";
                liTags += `<li class="main ${isNotFutur} ${isToday}">${b}</li>`;
            }
            let lastDayofMonth = new Date(currYears[a], currMonths[a], lastDateofMonth).getDay();
            for (b = lastDayofMonth; b < 6; b++) { 
                liTags += `<li class="main notmonth">${b - lastDayofMonth + 1}</li>`
            }
            daysTags[a].innerHTML = liTags;
                for (b = 0; b < daysTags[a].children.length; b++) {
                    daysTags[a].children[b].addEventListener("click", function(e) {
                        if (document.title != "Your Profile | DocBook") {
                            if (this.classList.contains("notmonth") == 0 && this.classList.contains("prev") == 0 && this.classList.contains("openedNow") == 0) {
                                reset(daysTags);
                                this.style.border = "1px solid white";
                                this.classList.add("openedNow");
                                drops[this.parentNode.classList[1]].style.display = "flex";
                                drops[this.parentNode.classList[1]].style.top = `${e.clientY + window.scrollY - 155}px`;
                                drops[this.parentNode.classList[1]].style.left = `${e.clientX - 35}px`;
                                openedDrop = 1;
                                boxIndex = this.parentNode.classList[1];
                                prefinalResult = this.innerHTML + " " + this.parentNode.parentNode.parentNode.children[0].children[0].innerHTML;
                                /*if (document.title == "Doctors | DocBook") {
                                    for (i = 0; i < doctors.length; i++) {
                                        for (j = 0; j < 16; j++) {
                                            dropMenus[i].children[j].classList.remove("cannot")
                                        }
                                    }
                                    for (i = 0; i < doctors.length; i++) {
                                        for (j = 0; j < 16; j++) {
                                            if ("choosenAndBooked" in doctors[i]) {
                                                for (k = 0; k < doctors[i].choosenAndBooked.length; k++) {
                                                    if (prefinalResult == doctors[i].choosenAndBooked[k].date) {
                                                        for (z = 0; z < doctors[i].choosenAndBooked[k].indexes.length; z++) {
                                                            if (j == doctors[i].choosenAndBooked[k].indexes[z]) {
                                                                dropMenus[i].children[j].classList.add("cannot")
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    for (i = 0; i < 16; i++) {
                                        dropMenu.children[i].classList.remove("cannot");
                                    }
                                    for (i = 0; i < 16; i++) {
                                        if ("choosenAndBooked" in doctor) {
                                            for (j = 0; j < doctor.choosenAndBooked.length; j++) {
                                                if (prefinalResult == doctor.choosenAndBooked[j].date) {
                                                    for (k = 0; k < doctor.choosenAndBooked[j].indexes.length; k++) {
                                                        if (i == doctor.choosenAndBooked[j].indexes[k]) {
                                                            dropMenu.children[i].classList.add("cannot");
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }*/
                            }
                            else if (this.classList.contains("prev") == 0) {
                                reset(daysTags);
                                drops[this.parentNode.classList[1]].style.display = "none";
                                openedDrop = 0;   
                            }
                        }
                        else if (this.classList.contains("notmonth") == 0 && this.classList.contains("prev") == 0) {
                            $(dateSpan).html(this.innerHTML + " " + this.parentNode.parentNode.parentNode.children[0].children[0].innerHTML).addClass("fade-in");
                            setTimeout(() => {
                                $(dateSpan).removeClass("fade-in");
                            }, 1000);
                            for (i = 0; i < 16; i++) {
                                allTimesButtons[i].classList.remove("unavail");
                                allTimesButtons[i].classList.remove("booked");
                            }
                            renderButtons();
                        }
                    })
                }
            
        }
    }
    renderCalendar();   
    document.querySelector("body").onclick = function(e) {
        if (e.target.classList.contains("main") == 0 && e.target.classList.contains("dropMenu") == 0 && e.target.classList.contains("duration") == 0 && e.target.classList.contains("cannot") == 0 && openedDrop == 1) {
            reset(drops);
            openedDrop = 0;
        }
    }   
    for (a = 0; a < currentDates.length; a++) {
        let icons = document.querySelectorAll(".wrapper header .icons");
        for (b = 0; b < 2; b++) {
            icons[a].children[b].addEventListener("click", (e) => {
                let order = e.target.parentNode.parentNode.parentNode.children[1].children[1].classList[1];
                currMonths[order] = e.target.src.includes("prev") ? currMonths[order] - 1 : currMonths[order] + 1;
                if(currMonths[order] < 0 || currMonths[order] > 11) { 
                    date = new Date(currYears[order], currMonths[order], new Date().getDate());
                    currYears[order] = date.getFullYear();
                    currMonths[order] = date.getMonth();
                } else {
                    date = new Date();
                }
                renderCalendar();
            });
        }
    }
}
allRendering();

let endPoint = "";
if (document.title == "Doctors | DocBook") {
    let searchSpinner = document.querySelector(".parent .content .bar form .spinner");
    document.querySelector(".parent .content .bar form .submit").addEventListener("click", function(e) {
        e.preventDefault();
        if (showHere.innerHTML == "Choose a speciality") {
            alert("Can not search without choosing a speciality!");
        }
        else {
            if (showHere.innerHTML != "Choose a speciality" && doctorNameInput.value == "") {
                endPoint = `/home/doctor/${showHere.innerHTML}`;
            }
            else if (showHere.innerHTML != "Choose a speciality" && doctorNameInput.value != "") {
                endPoint = `/home/search/${showHere.innerHTML}/specialtyanduserName/${doctorNameInput.value}`;
            }
            searchSpinner.style.display = "block";
            fetch(`${domain}${endPoint}`, {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data=> {
                searchSpinner.style.display = "none";
                while (boxes.firstChild) {
                    boxes.removeChild(boxes.firstChild);
                }
                if (data.hasOwnProperty("doctors")) {
                    console.log(data.doctors);
                    for (j = 0; j < data.doctors.length; j++) {
                        for (i = 0; i < doctorsPreInfo.length; i++) {
                            if (data.doctors[j]._id == doctorsPreInfo[i]._id) {
                                renderDoctors();
                            }
                        }
                        allRendering();
                        renderDropMenus();
                    }
                    let viewProfAsid = document.querySelectorAll(".parent .content .boxes .box .first aside");
                    let bookButtons = document.querySelectorAll(".parent .content .boxes .box .first button");
                    for (i = 0; i < data.doctors.length; i++) {
                        viewProfAsid[i].addEventListener("click", function() {
                            localStorage.setItem("doctorOpenedId", data.doctors[Array.prototype.indexOf.call(viewProfAsid, this)]._id);
                            location.href = "docProfForPatient.html";
                        })
                        bookButtons[i].addEventListener("click", function() {
                            let index = Array.prototype.indexOf.call(bookButtons, this);
                            document.querySelectorAll(".parent .content .boxes .box .first .spinner")[index].style.display = "block";
                            localStorage.setItem("doctorOpenedId", data.doctors[index]._id);        
                            fetch(`${domain}/doctor/account/profile/${data.doctors[index]._id}`, {
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
                }
                else {
                    boxes.innerHTML = (`<h2>Not Found!</h2>`)
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    })
}