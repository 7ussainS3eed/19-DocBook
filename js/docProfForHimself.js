function updateSpanRandomly() {
    var elements = [
        'Your expertise and care save lives, shaping a brighter future.', 
        'Through your dedication, lives are transformed.', 
        'Your tireless efforts and knowledge make a world of difference.', 
        'Thank you for being a beacon of light in times of darkness.', 
        'With every patient you treat, you restore faith in humanity.', 
        'By choosing medicine, you have chosen a path of immense impact.', 
        'Your dedication heals and inspires.', 
        'Grateful for your life-saving care.', 
        'Your skill saves lives daily.', 
        'Thank you for being exceptional.', 
        'We value your life-saving work.'
    ];
    var progressBar = document.querySelector('.progress-bar');
    var span = progressBar.querySelector('.progress .text');
    var randomIndex = Math.floor(Math.random() * elements.length);
    span.innerHTML = elements[randomIndex];
}
updateSpanRandomly();
setInterval(updateSpanRandomly, 8000);

let doctorMainData = JSON.parse(localStorage.getItem("doctorMainData"));
let editPhoto = function() {
    let updatePhotoSpinner = document.querySelector(".parent .content .setting .space .content2 .forms .left .buttonss .spinner");
    updatePhotoSpinner.style.display = "block";
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
        updatePhotoSpinner.style.display = "none";
        swal(data.message)
        .then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.log('Error:', error);
    });
}
let editProfile = function() {
    let editProfSpinner = document.querySelector(".parent .content .setting .space .content2 .forms .edit-information .spinner");
    editProfSpinner.style.display = "block";
    let inputs = document.querySelectorAll(".parent .content .setting .space .content2 .forms .left .edit-information input");
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
        editProfSpinner.style.display = "none";
        swal(data.message)
        .then(() => {
            location.reload();
        });
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
                window.scrollTo(0, 0)
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
                    <p>${allDoctorData.specialty ? allDoctorData.specialty : 'Cardiology (Heart)'}</p>
                </div>
            </div>
            <div class="about">
                <h5>About Me:</h5>
                <p>${allDoctorData.aboutme ? allDoctorData.aboutme : "Hasn’t Been Set Yet!"}</p>
            </div>
            <h5>Experience: <span>${Math.floor(Math.random() * 8) + 3} Years</span></h5>
            <h5>Rate: <span>${allDoctorData.raiting >= 1 ? allDoctorData.raiting.toFixed(1) + " / 5" : "Not Yet!"}</span></h5>
            <h5>Service: <span>${allDoctorData.price ? allDoctorData.price : 50}$</span></h5>
        `);
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
        if (allDoctorData.numReviews == 0) {
            let noreviews = document.createElement("img");
            noreviews.src = "../images/reviews.png";
            noreviews.style.width = "560px";
            noreviews.style.height = "260px";
            commentsDiv.appendChild(noreviews);
        }
        else {
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
                        <span>Private Review</span>
                    </div>
                    <div>
                        <div></div>
                        <p>${allDoctorData.reviews[i].comment}</p>
                    </div>
                `);
                commentsDiv.appendChild(full);
            }
            for (i = 0; i < allDoctorData.numReviews; i++) {
                for (j = 0; j < allDoctorData.reviews[i].rating; j++) {
                    let star = document.createElement("img");
                    star.setAttribute("src", "./images/rate.png");
                    document.querySelectorAll(".comments .full div div")[i].appendChild(star);
                }
            }
        }
        document.querySelector(".parent .content .dash .left .greating h2 span").innerHTML = (`Dr. ${allDoctorData.userName.split(" ")[0]}`) //rendering the doctor name in the first box found in dashboard page
        let renderReports = function() {
            fetch(`${domain}/admin/accounts/${doctorMainData.userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${doctorMainData.token}`
                },
            })
            .then(response => response.json())
            .then(objContainReports => {
                //rendering weekly report
                let spans = document.querySelectorAll(".parent .content .dash .right .status div span:last-of-type");
                let reports = [objContainReports.totals.totalOrders, objContainReports.totals.totalPaid + "$", objContainReports.totals.doctorGained + "$"]
                for (i = 0; i < 3; i++) {
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

function getFormattedDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var day = String(today.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}
var formattedDate = getFormattedDate();
let appointmentsBox = document.querySelector(".parent .content .dash .left .outer .box");
let nextPatientDiv = document.querySelector(".parent .content .dash .right .father");
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
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const sixtyMinutesAgo = currentTime - 60;
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
            const isWithin60Minutes = (startTime >= sixtyMinutesAgo && startTime <= currentTime);
            return (isWithin60Minutes || (!isPast && currentTime - startTime <= 60));
        });
        filteredArr.sort((a, b) => {
            const timeA = parseTime(a.start);
            const timeB = parseTime(b.start);
            return timeA - timeB;
        });
        return filteredArr;
    }
    const filteredArr = filterObjectsByTime(allTodyAppons);
    let finalFilteredArr = [];
    for (i = 0; i < filteredArr.length; i++) {
        if (filteredArr[i].patient != null) {
            finalFilteredArr.push(filteredArr[i]);
        }
    }
    if (finalFilteredArr == 0) {
        let noappon = document.createElement("img");
        noappon.src = "../images/appointment.png";
        noappon.style.cssText = "width: 300px; margin-left: -10px"
        appointmentsBox.appendChild(noappon);
        document.querySelector(".parent .content .dash .right .father .control").style.display = "none";
        let noPatientP = document.createElement("p");
        noPatientP.innerHTML = "All next patient details will be listed here when they are available.";
        noPatientP.style.cssText = "margin-top: 5px; color: var(--main-color); font-size: 33px; line-height: 1";
        nextPatientDiv.appendChild(noPatientP);
        let noPatientImg = document.createElement("img");
        noPatientImg.src = "../images/wait2.png";
        noPatientImg.style.cssText = "width: 400px; position: absolute; top: 340px; right: -40px;";
        nextPatientDiv.appendChild(noPatientImg)
        nextPatientDiv.style.height = "289px";
    }
    else {
        for (i = 0; i < finalFilteredArr.length; i++) {
            function convertTimeFormat(timeString) {
                const [time, meridiem] = timeString.split(' ');
                const [hours, minutes] = time.split(':');
                let formattedHours = hours;
                if (hours.length === 1) {
                    formattedHours = '0' + hours;
                }
                return formattedHours + ':' + minutes + ' ' + meridiem.toUpperCase();
            }
            const inputTime = finalFilteredArr[i].start;
            const convertedTime = convertTimeFormat(inputTime);
            let appointment = document.createElement("div");
            appointment.classList.add("appoint");
            if (finalFilteredArr.length == 1) {
                appointment.style.paddingBottom = "10px"
            }
            appointment.innerHTML = (`
                <div>
                    <img src="../images/user.png">
                    <span>${finalFilteredArr[i].patient.userName}</span>
                </div>
                <span>${convertedTime}</span>
            `);
            appointmentsBox.appendChild(appointment);
        }
        if (finalFilteredArr.length != 0) {
            fetch(`${domain}/user/account/profile/${finalFilteredArr[0].patient._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${doctorMainData.token}`,
                },
            })
            .then(response => response.json())
            .then(nextPatientData => {
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
        let noteSpinner = document.querySelector(".note span .spinner");
        document.querySelector(".note span button").onclick = function() {
            noteSpinner.style.display = "block";
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
                noteSpinner.style.display = "none";
                swal(data.message)
                .then(() => {
                    location.reload();
                });
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
    }
})
.catch(error => {
    console.error(error);
});

fetch(`${domain}/doctor/getAllResrvationDay/${doctorMainData.userId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${doctorMainData.token}`,
    },
})
.then(response => response.json())
.then(allAppons => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    const newArray = allAppons.filter(obj => {
    const objDate = new Date(obj.time);
        if (objDate < tomorrow) {
            return false;
        }
        return true;
    });
    newArray.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        const startTimeA = new Date(`2000-01-01 ${a.start}`);
        const startTimeB = new Date(`2000-01-01 ${b.start}`);
        if (startTimeA < startTimeB) {
            return -1;
        }
        if (startTimeA > startTimeB) {
            return 1;
        }
        return 0;
    });
    const formattedArray = newArray.map(obj => {
        const date = new Date(obj.time);
        const day = date.toLocaleDateString('en-US', { day: 'numeric' });
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        const year = date.toLocaleDateString('en-US', { year: 'numeric' });
        const formattedTime = `${day} ${month} ${year}`;
        const formattedStart = new Date(`2000-01-01 ${obj.start}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return {
            ...obj,
            time: formattedTime,
            start: formattedStart
        };
    });
    let finalFormattedArray = [];
    for (i = 0; i < formattedArray.length; i++) {
        if (formattedArray[i].patient != null) {
            finalFormattedArray.push(formattedArray[i])
        }
    }
    let appointmentsBox2 = document.querySelector(".parent .content .dash .left .outer2 .box2")
    if (finalFormattedArray.length == 0) {
        let noappon2 = document.createElement("img");
        noappon2.src = "../images/appointment.png";
        noappon2.style.cssText = "width: 300px; margin-left: -10px"
        appointmentsBox2.appendChild(noappon2);
    }
    else {
        for (i = 0; i < finalFormattedArray.length; i++) {
            let appointment = document.createElement("div");
            appointment.classList.add("appoint2");
            appointment.innerHTML = (`
                <div>
                    <img src="../images/user.png">
                    <span>${finalFormattedArray[i].patient.userName}</span>
                </div>
                <div>
                    <span>${finalFormattedArray[i].time}</span>
                    <span>${finalFormattedArray[i].start}</span>
                </div>
            `);
            appointmentsBox2.appendChild(appointment);
        }
    }
})
.catch(error => {
    console.error(error);
});

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
        changeDoctorPassSnipper.style.display = "none";
        swal(data.message)
        .then((value) => {
            if (!data.hasOwnProperty("status")) {
                location.reload();
            }
        });
    })
    .catch(error => {
        console.error(error);
    });
}