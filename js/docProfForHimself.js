let doctorMainData = JSON.parse(localStorage.getItem("doctorMainData"));
let editPhoto = function() {
    document.querySelector(".parent .content .setting .space .content2 .forms .left .buttonss .spinner").style.display = "block";
    var formData = new FormData();
    formData.append('photo', $('#profile')[0].files[0]);
    fetch(`${domain}/doctor/account/updatePhoto/${doctorMainData.userId}`, {
        method: 'PUT',
        body: formData,
        headers: {
            'Authorization': `Bearer ${doctorMainData.token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error:', response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => {
        console.log('Error:', error);
    });
}
let editProfile = function() {
    let inputs = document.querySelectorAll(".parent .content .setting .space .content2 .forms .left .edit-information input");
    document.querySelector(".parent .content .setting .space .content2 .forms .edit-information .spinner").style.display = "block";
    fetch(`${domain}/doctor/account/profile/${doctorMainData.userId}`, {
    method: 'PUT',
    body: JSON.stringify({
        "userName": inputs[0].value,
        "price": inputs[1].value,
        "aboutme": document.querySelector(".parent .content .setting .space .content2 .forms .left .edit-information textarea").value,
        "specialty": document.querySelector(".parent .content .setting .space .content2 .forms .left .edit-information select").value
    }),
    headers: {
        'Authorization': `Bearer ${doctorMainData.token}`,
        'Content-Type': 'application/json'
    }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error:', response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message)
        location.reload();
    })
    .catch(error => {
        console.log('Error:', error);
    });
}
let html = document.querySelector("html");
$.ajax({
    url: `${domain}/doctor/account/profile/${doctorMainData["userId"]}`,
    type: 'GET',
    headers: {
        'Authorization': `Bearer ${doctorMainData["token"]}`
    },
    success: function(allDoctorData) {
        //rendering the left nav
        document.querySelector("nav").innerHTML = (`
            <div>
                <img src="${allDoctorData.photo}">
            </div>
            <h3>Dr. ${allDoctorData.userName}</h3>
            <div class="0 active">Profile</div>
            <div class="1">Dashboard</div>
            <div class="2">Edit Profile</div>
            <div>Log Out</div>
        `);
        document.getElementById('overlay').classList.add('hide-overlay');
        html.style.overflow = "auto";
        window.scrollTo(0, 0);
        //handeling the changes happen when click on first three buttons found in left nav
        let choises = document.querySelectorAll(".parent .content nav div:not(:first-of-type):not(:last-of-type)");
        let windows = [document.querySelector(".parent .content .profile"), document.querySelector(".parent .content .dash"), document.querySelector(".parent .content .setting")];
        for(i = 0; i < choises.length; i++) {
            choises[i].onclick = function() {
                for(j = 0; j < choises.length; j++) {
                    choises[j].classList.remove("active");
                    windows[j].style.display = "none";
                }
                this.classList.add("active");
                if (this.classList[0] == 1) {
                    windows[this.classList[0]].style.display = "flex";
                }
                else {
                    windows[this.classList[0]].style.display = "block";
                }
            }
        }
        document.querySelector(".parent .content nav div:nth-of-type(5)").onclick = function() {
            localStorage.clear();
            location.href = "index.html";
        }
        //rendering the first box in profile page which contains some informations about doctor
        document.querySelector(".parent .content .profile .content2 .box").innerHTML = (`
            <div class="main">
                <img src="${allDoctorData.photo}">
                <div>
                    <h4>Dr. ${allDoctorData.userName}</h4>
                    <p>${allDoctorData.specialty ? allDoctorData.specialty : 'Specialty hasn’t been set yet!'}</p>
                </div>
            </div>
            <div class="about">
                <h5>About Me:</h5>
                <p>${allDoctorData.aboutme ? allDoctorData.aboutme : "Hasn’t Been Set Yet!"}</p>
            </div>
            <h5>Experience: <span>${Math.floor(Math.random() * 26) + 5} Years</span></h5>
            <h5>Rate: <span>${allDoctorData.raiting >= 1 ? allDoctorData.raiting.toFixed(1) + " / 5" : "Not Yet!"}</span></h5>
            <h5>Service: <span>${allDoctorData.price ? allDoctorData.price + "$" : "Hasn’t Been Set Yet!"}</span></h5>
        `);
        if (allDoctorData.specialty) {
            function createDoctor() {
                const choosenLength = Math.floor(Math.random() * 4) + 2;
                const bookedLength = Math.floor(Math.random() * 4) + 2;
                const choosen = generateUniqueNumbers(choosenLength, []);
                const booked = generateUniqueNumbers(bookedLength, choosen);
                const doctor = {
                    duration: "30 min",
                    choosen: choosen,
                    booked: booked
                };
                return doctor;
            }
            function generateUniqueNumbers(length, excludeArr) {
                const numbers = [];
                for (let i = 0; i < length; i++) {
                    let randomNumber;
                    do {
                        randomNumber = Math.floor(Math.random() * 16);
                    } 
                    while (numbers.includes(randomNumber) || excludeArr.includes(randomNumber));
                    numbers.push(randomNumber);
                }
                return numbers;
            }
            const doctor = createDoctor();
            let renderButtons = function() {
                for (j = 0; j < doctor.choosen.length; j++) {
                    allTimesButtons[doctor.choosen[j]].classList.add("unavail");
                }
                for (j = 0; j < doctor.booked.length; j++) {
                    allTimesButtons[doctor.booked[j]].classList.add("booked");
                }
            }
            renderButtons();
        }
        document.querySelector(".reviews").innerHTML = (`
            <h2>Patient Reviews</h2>
            <div>
                <span>${allDoctorData.raiting.toFixed(1) >= 1 ? allDoctorData.raiting.toFixed(1) : "Not Yet!"}</span>
                <div class="stars"></div>
            </div>
            <p>${allDoctorData.numReviews ? "From " + allDoctorData.numReviews + " Visitor" : ""}</p>
            <div></div>
        `);
        for (i = 0; i < parseInt(allDoctorData.raiting); i++) {
            let star = document.createElement("img")
            star.setAttribute("src", "./images/rate.png")
            document.querySelector(".reviews div .stars").appendChild(star)
        }
        let stars = 5
        const ratingCounts = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0
        };
        allDoctorData.reviews.forEach((review) => {
            const rating = review.rating;
            ratingCounts[rating]++;
        });
        const countsArray = Object.values(ratingCounts).reverse();
        for (i = 0; i < 5; i++) {
            let fullReview = document.createElement("div")
            fullReview.innerHTML = (`
                <img src="./images/rate2.png">
                <span>${stars}</span>
                <span>
                    <span></span>
                </span>
                <span class="handle">${countsArray[i]} Visitor</span>
            `)
            stars--
            document.querySelector(".reviews p ~ div").appendChild(fullReview)
        }
        let max = countsArray[0];
        for (i = 1; i < 5; i++) {
            if (countsArray[i] > max) {
                max = countsArray[i]
            }
        }
        for (i = 0; i < 5; i++) {
            if (countsArray[i] == 0) {
                document.querySelectorAll(".reviews p ~ div div")[i].style.display = "none"
            }
            else {
                document.querySelectorAll(".reviews p ~ div div span:nth-of-type(2) span")[i].style.width = `${countsArray[i]/max*100}%`
            }
        }
        let commentsDiv = document.querySelector(".comments");
        for (i = 0; i < allDoctorData.numReviews; i++) {
            let full = document.createElement("div");
            full.classList.add("full");
            if (i == 0) {
                full.style.paddingTop = "0";
            }
            if (i == allDoctorData.numReviews-1) {
                full.style.cssText = "padding-bottom: 0; border-bottom: none"
            }
            full.innerHTML = (`
                <div>
                    <img src="../images/user.png">
                    <span>Review ${allDoctorData.reviews[i]._id.slice(-5)}</span>
                </div>
                <div>
                    <div></div>
                    <p>${allDoctorData.reviews[i].comment}</p>
                </div>
            `);
            commentsDiv.appendChild(full);
        }
        for (i = 0; i < allDoctorData.numReviews; i++) {
            commentsDiv.style.height = "495px"
            let replyDiv = document.createElement("div");
            replyDiv.innerHTML = (`
                <input type="text" placeholder="Reply">
                <img src="images/send.png">
            `)
            commentsDiv.children[i].style.paddingBottom = "70px";
            if (i == allDoctorData.numReviews-1) {
                commentsDiv.children[i].style.paddingBottom = "52px";
                replyDiv.style.bottom = 0;
            }
            commentsDiv.children[i].appendChild(replyDiv);
        }
        for (i = 0; i < allDoctorData.numReviews; i++) {
            for (j = 0; j < allDoctorData.reviews[i].rating; j++) {
                let star = document.createElement("img");
                star.setAttribute("src", "./images/rate.png");
                document.querySelectorAll(".comments .full div div")[i].appendChild(star);
            }
        }
        document.querySelector(".parent .content .dash .left .greating h2 span").innerHTML = (`Dr.${allDoctorData.userName.split(" ")[0]}`) //rendering the doctor name in the first box found in dashboard page
        let renderReports = function() {
            fetch(`${domain}/admin/accounts/${doctorMainData.userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${doctorMainData.token}`
                },
            })
            .then(response => response.json())
            .then(objContainReports => {
                console.log(objContainReports);
                //rendering weekly report
                let spans = document.querySelectorAll(".parent .content .dash .right .status div span:last-of-type");
                let reports = [objContainReports.totals.totalOrders, objContainReports.totals.totalPaid + "$", objContainReports.totals.doctorGained + "$", allDoctorData.numReviews]
                for (i = 0; i < 4; i++) {
                    spans[i].innerHTML = reports[i] ? reports[i] : "Not Yet!";
                }
            })
            .catch(error => {
                console.error(error);
            });
        };
        renderReports();
        document.querySelector(".parent .content .setting .space .content2 .forms .left").innerHTML = (`
            <label for="profile">
                <img src=${allDoctorData.photo} class="profImg">
                <div class="overlay"></div>
                <img src="./images/upload2.png" class="profImg">
            </label>
            <input type="file" id="profile" hidden>
            <div class="buttonss">
                <button>Upload</button>
                <button>Cancel</button>
                <div class="spinner"></div>
            </div>
            <div class="edit-information">
                <h5>Edit information</h5>
                <input type="text" value="${allDoctorData.userName}" placeholder="User Name">
                <select id="specialtyDropdown">
                    <option value="">--Specialty--</option>
                    <option value="Cardiology (Heart)">Cardiology (Heart)</option>
                    <option value="Neurology (Brain & Nerves)">Neurology (Brain & Nerves)</option>
                    <option value="Pediatrics and Newborn">Pediatrics and Newborn</option>
                    <option value="Orthopedics (Bones)">Orthopedics (Bones)</option>
                    <option value="Chest and Respiratory">Chest and Respiratory</option>
                    <option value="Scan Centers">Scan Centers</option>
                </select>
                <input type="number" value=${allDoctorData.price} placeholder="Price">
                <textarea placeholder="About me">${allDoctorData.aboutme ? allDoctorData.aboutme : ""}</textarea>
                <button>Save</button>
                <div class="spinner"></div>
            </div>
        `);
        var defaultValue = `${allDoctorData.specialty}`;
        var selectElement = document.getElementById("specialtyDropdown");
        for (var i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === defaultValue) {
                selectElement.selectedIndex = i;
                break;
            }   
        }
        editProfileImg();
        document.querySelector(".parent .content .setting .space .content2 .forms .left .buttonss button:first-of-type").onclick = () => editPhoto();
        document.querySelector(".parent .content .setting .space .content2 .forms .left .edit-information button").onclick = () => editProfile();
    },
    error: function(xhr, status, error) {
        console.error(error);
    }
});

//rendering the date span for the first time with the initial value which is tomorrow
let toBeTommorw = new Date()
toBeTommorw.setDate(toBeTommorw.getDate() + 1)
let dateSpan = document.querySelector(".parent .content .profile .content3 .content4 .wrapper + div .times h5 span")
dateSpan.innerHTML = `${toBeTommorw.getDate()} ${toBeTommorw.toLocaleString("default", {month: "long"})} ${toBeTommorw.getFullYear()}`

//rendering the time buttons for the first time with the initial green state
let times = ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"]
for (i = 0; i < 16; i++) {
    let timeButton = document.createElement("button");
    (i%2 !== 0) ? timeButton.classList.add("changing") : null;
    timeButton.innerHTML = times[i];
    document.querySelector(".parent .content .profile .content3 .content4 .wrapper + div .times .buttons2").appendChild(timeButton);
}

/*let doctor = {
    duration: "30 min",
    times: [
        {
            date: "22 June 2023",
            choosen: [7, 13],
            booked: [1, 3, 4]
        },
        {
            date: "23 June 2023",
            choosen: [0, 8, 15]
        },
        {
            date: "24 June 2023",
            booked: [9, 14]
        }
    ],
}*/
let allTimesButtons = document.querySelectorAll(".parent .content .profile .content3 .content4 .wrapper + div .times .buttons2 button")
/*let renderButtons = function() {
    for (i = 0; i < doctor.times.length; i++) {
        if (dateSpan.innerHTML == doctor.times[i].date) {
            if ("choosen" in doctor.times[i]) {
                for (j = 0; j < doctor.times[i].choosen.length; j++) {
                    allTimesButtons[doctor.times[i].choosen[j]].classList.add("unavail")
                }
            }
            if ("booked" in doctor.times[i]) {
                for (j = 0; j < doctor.times[i].booked.length; j++) {
                    allTimesButtons[doctor.times[i].booked[j]].classList.add("booked")
                }
            }
            break
        }
    }
}
renderButtons()*/

//rendering the two duration buttons, also rendering the time buttons for the third time but with the red states comes from the duration if found
let durationButtons = document.querySelectorAll(".parent .content .profile .content3 .content4 .wrapper + div .duration .buttons button")
let changing = document.querySelectorAll(".parent .content .profile .content3 .content4 .wrapper + div .times .buttons2 .changing")
let handelDuration = function(addTo, removeFrom, addOrRemove) {
    $(addTo).addClass("active")
    $(removeFrom).removeClass("active")
    for (j = 0; j < 8; j++) {
        (addOrRemove == "add") ? $(changing[j]).addClass("force-unavail") : $(changing[j]).removeClass("force-unavail")
    }
}

function getFormattedDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}
var formattedDate = getFormattedDate();
fetch(`${domain}/doctor/getResrvationDays/${doctorMainData.userId}/time/${formattedDate}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${doctorMainData.token}`,
    },
})
.then(response => response.json())
.then(allTodyAppons => {
    function filterObjectsByTime(arr) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes(); //convert current time to minutes
        const thirtyMinutesAgo = currentTime - 30; //subtract 30 minutes from the current time
        function parseTime(timeString) {
            const [hour, minute, period] = timeString.toLowerCase().split(/[:\s]/);
            let hours = parseInt(hour);
            const minutes = parseInt(minute);
            if (period === 'pm' && hours < 12) {
                hours += 12;
            }
            return hours * 60 + minutes;
        }
        const filteredArr = arr.filter(obj => {
            const startTime = parseTime(obj.start);
            const isPast = startTime < currentTime;
            const isWithin30Minutes = (startTime >= thirtyMinutesAgo && startTime <= currentTime);
            return (isWithin30Minutes || (!isPast && currentTime - startTime <= 30));
        });
        filteredArr.sort((a, b) => {
            const timeA = parseTime(a.start);
            const timeB = parseTime(b.start);
            return timeA - timeB;
        });
        return filteredArr;
    }
    const filteredArr = filterObjectsByTime(allTodyAppons);
    for (i = 0; i < filteredArr.length; i++) {
        function convertTimeFormat(timeString) {
            const [time, meridiem] = timeString.split(' ');
            const [hours, minutes] = time.split(':');
            let formattedHours = hours;
            if (hours.length === 1) {
                formattedHours = '0' + hours;
            }
            return formattedHours + ':' + minutes + ' ' + meridiem.toUpperCase();
        }
        const inputTime = filteredArr[i].start;
        const convertedTime = convertTimeFormat(inputTime);
        let appointment = document.createElement("div");
        appointment.classList.add("appoint");
        if (filteredArr.length == 1) {
            appointment.style.paddingBottom = "10px"
        }
        appointment.innerHTML = (`
            <div>
                <img src="../images/user.png">
                <span>${filteredArr[i].patient.userName}</span>
            </div>
            <span>${convertedTime}</span>
        `);
        document.querySelector(".parent .content .dash .left .outer .box").appendChild(appointment);
    }
    if (filteredArr.length != 0) {
        fetch(`${domain}/user/account/profile/${filteredArr[0].patient._id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${doctorMainData.token}`,
            },
        })
        .then(response => response.json())
        .then(nextPatientData => {
            console.log(nextPatientData);
            //rendering next patient details
            document.querySelector(".parent .content .dash .right .father .child").innerHTML = (`
                <div class="left2">
                    <img src="../images/user.png">
                    <h6>${nextPatientData.userName}</h6>
                    <h6>Phone number</h6>
                    <span>Not Set Yet!</span>
                    <h6>Address</h6>
                    <span>Not Set Yet!</span>
                    <h6>Email</h6>
                    <span>${nextPatientData.email}</span>
                </div>
                <div class="right2">
                    <div class="up">
                        <div>
                            <h6>Gender</h6>
                            <span>Not Set Yet!</span>
                            <h6>Smoking</h6>
                            <span>${nextPatientData.smoking ? nextPatientData.smoking : "Not Set Yet!"}</span>
                        </div>
                        <div>
                            <h6>Marital status</h6>
                            <span>${nextPatientData.maritalstatus ? nextPatientData.maritalstatus : "Not Set Yet!"}</span>
                            <h6>Age</h6>
                            <span>${nextPatientData.birthDate}</span>
                        </div>
                    </div>
                    <div class="down">
                        <div>
                            <h6>Weight</h6>
                            <span>${nextPatientData.weight ? nextPatientData.weight + " kg" : "Not Set Yet!"}</span>
                            <h6>Allergies</h6>
                            <span>${nextPatientData.allergies ? nextPatientData.allergies : "Not Set Yet!"}</span>
                        </div>
                        <div>
                            <h6>Height</h6>
                            <span>${nextPatientData.height ? nextPatientData.height + " cm" : "Not Set Yet!"}</span>
                        </div>
                    </div>
                </div>
            `);
        })
        .catch(error => {
            console.error(error);
        });
    }
    //rendering the note box which shown over when the doctor click on the note button found in the next patient box
    let note = document.querySelector(".note");
    let today = new Date();
    note.innerHTML = (`        
        <h5>Write Note</h5>    
        <div>
            <h6>${today.getDate()} ${today.toLocaleString("default", {month: "long"})} ${today.getFullYear()}</h6>
            <textarea>loream loream loream loream loream loream loream</textarea>
        </div>
        <span>
            <button>Send</button>
            <div class="spinner"></div>
        </span>
    `);
    document.querySelector(".note span button").onclick = function() {
        document.querySelector(".note span .spinner").style.display = "block";
        fetch(`${domain}/createNotes/${filteredArr[0].patient._id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${doctorMainData.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "content": document.querySelector(".note h5 + div textarea").value,
                "user": `${filteredArr[0].patient._id}`,
                "doctor": `${doctorMainData.userId}`
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(error => {
            console.error(error);
        });
    }
    //handeling the changes happen when the doctor click on the note button found in the next patient box
    document.querySelector(".parent .content .dash .right .father .control div:last-of-type").onclick = function() {
        over.style.display = "block";
        window.scroll(0, 0)
        note.style.display = "block";
        html.style.overflow = "hidden";
        let myInput = document.querySelector(".note h5 + div textarea");
        myInput.focus();
        let myInputValue = myInput.value;
        myInput.setSelectionRange(myInputValue.length, myInputValue.length);
    }
    let over = document.querySelector(".over");
    over.addEventListener ("click", function() {
        note.style.display = "none";
        over.style.display = "none";
        html.style.overflow = "auto";
    })
})
.catch(error => {
    console.error(error);
});

//handeling the changes happen when edit and save buttons clicked
let editAndSave = document.querySelectorAll(".parent .content .profile .content3 .head button")
let head = document.querySelector(".parent .content .profile .content3 .head")
let noneAndAppear = function(toNone, toApper, wayToAppear) {
    toNone.style.display = "none"
    if (toApper != undefined && wayToAppear != undefined) {
        toApper.style.display = wayToAppear
    }
}
let content4 = document.querySelector(".parent .content .profile .content3 .content4")
for (i = 0; i < 2; i++) {
    editAndSave[i].onclick = function() {
        if(this.innerHTML == "Edit") {
            head.style.marginBottom = "24px"
            noneAndAppear(this, editAndSave[1], "block")
            noneAndAppear(this, content4, "flex")
        }
        else {
            head.style.marginBottom = 0
            noneAndAppear(this, editAndSave[0], "block")
            noneAndAppear(content4)
        }
    }
}

//handeling the changes happen when the two duration buttons clicked
for (i = 0; i < 2; i++) {
    durationButtons[i].onclick = function() {
        if (this.innerHTML == "30 min" && this.classList.contains("active") == 0) {
            handelDuration(this, durationButtons[1], "remove")
        }
        else if (this.innerHTML == "1 hr" && this.classList.contains("active") == 0) {
            handelDuration(this, durationButtons[0], "add")
        }
    }
}

//handeling the changes happen when any time button clicked
/*let tempTimes= doctor.times
for (i = 0; i < 16; i++) {
    allTimesButtons[i].onclick = function() {
        if (this.classList.contains("force-unavail") == 0) {
            let buttonIndex = Array.prototype.indexOf.call(allTimesButtons, this)
            if (this.classList.contains("unavail") == 0 && this.classList.contains("booked") == 0) {
                let found = 0
                this.classList.add("unavail")
                for (let j = 0; j < tempTimes.length; j++) {
                    if (dateSpan.innerHTML == tempTimes[j].date) {
                        if ("choosen" in tempTimes[j]) {
                            tempTimes[j].choosen.push(buttonIndex)
                        }
                        else {
                            tempTimes[j].choosen = [buttonIndex]
                        }
                        
                        found++
                        break
                    }
                }
                if (found == 0) {
                    tempTimes.push(
                        {
                            date: dateSpan.innerHTML,
                            choosen: [buttonIndex]
                        }
                    )
                }
            }
            else if (this.classList.contains("unavail")) {
                this.classList.remove("unavail")
                for (let j = 0; j < tempTimes.length; j++) {
                    if (dateSpan.innerHTML == tempTimes[j].date) {
                        tempTimes[j].choosen.splice(tempTimes[j].choosen.indexOf(buttonIndex), 1)
                        if (tempTimes[j].choosen.length == 0 && !("booked" in tempTimes[j])) {
                            tempTimes.splice(j, 1)
                        }
                        break
                    }
                }
            }
        }
    }
}*/
for (i = 0; i < 16; i++) {
    allTimesButtons[i].onclick = function() {
        if (this.classList.contains("force-unavail") == 0) {
            let buttonIndex = Array.prototype.indexOf.call(allTimesButtons, this)
            if (this.classList.contains("unavail") == 0 && this.classList.contains("booked") == 0) {
                this.classList.add("unavail")
            }
            else if (this.classList.contains("unavail")) {
                this.classList.remove("unavail")
            }
        }
    }
}

let passwordFields = document.querySelectorAll(".parent .content .setting .space .content2 .forms .right .change input");
let changeDoctorPassSnipper = document.querySelector(".parent .content .setting .space .content2 .forms .right .change .spinner");
document.querySelector(".parent .content .setting .space .content2 .forms .right .change button").onclick = function() {
    changeDoctorPassSnipper.style.display = "block";
    let passedData = {
        "password": passwordFields[1].value,
        "confirmPassword": passwordFields[2].value
    }
    fetch(`${domain}/doctor/account/changePassword/${doctorMainData["userId"]}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${doctorMainData["token"]}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passedData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } 
        else {
            throw new Error('Error: ' + response.status);
        }
    })
    .then(data => {
        alert(data.message);
        if (!data.hasOwnProperty("status")) {
            location.reload();
        }
        else {
            changeDoctorPassSnipper.style.display = "none";
        }
    })
    .catch(error => {
        console.error(error);
    });
}