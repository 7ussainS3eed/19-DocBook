document.querySelector(".content .controling .account span:first-of-type").onclick = function() {
    localStorage.clear();
    location.href = "index.html";
}

let deleteAcSpinner = document.querySelector(".sure .spinner");
deleteAcSpinner.style.cssText = "bottom: 8px; right: 8px; display: none";
let patientMainData = JSON.parse(localStorage.getItem("patientMainData"));
document.querySelector(".sure div button:first-of-type").onclick = function() {
    deleteAcSpinner.style.display = "block";
    fetch(`${domain}/user/account/profile/${patientMainData.userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${patientMainData.token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        localStorage.clear();
        location.href = "index.html"
    })
    .catch(error => {
        console.error(error);
    });
}

let patientSeconderyData = JSON.parse(localStorage.getItem("patientSeconderyData"));
document.querySelector(".content2").innerHTML = (`
    <div class="top">
        <div class="left">
            <h4>Edit Profile</h4>
            <div class="box">
                <form>
                    <label for="profile">
                    <img src="../images/user.png" class="profImg">
                    <div class="overlay"></div>
                    <img src="./images/upload2.png">
                    </label>
                    <input type="file" id="profile" hidden>
                </form>
                <div class="buttonss">
                    <button>Upload</button>
                    <button>Cancel</button>
                </div>
                <h3>${patientSeconderyData.userName}</h3>
            </div>
        </div>
        <div class="right">
            <h4>Edit user information</h4>
            <div class="box">
                <div class="left2">
                    <input type="text" value="${patientSeconderyData.userName}" placeholder="User Name">
                    <div class="calc">
                        <input type="number" value="${patientSeconderyData.height ? patientSeconderyData.height : ""}" placeholder="Height">
                        <input type="number" value="${patientSeconderyData.weight ? patientSeconderyData.weight : ""}" placeholder="Weight">
                    </div>
                    <div class="smoking">
                        <span class="last-handel">${patientSeconderyData.smoking ? patientSeconderyData.smoking : "Smoking"}</span>
                        <img src="./images/down2.png" class="last-handel">
                        <i class="fa-solid fa-smoking"></i>
                        <div class="drop">
                            <div>Yes</div>
                            <div>No</div>
                        </div>
                    </div>
                </div>
                <div class="right2">
                    <div class="status">
                        <span class="last-handel">${patientSeconderyData.maritalstatus ? patientSeconderyData.maritalstatus : "Marital Status"}</span>
                        <img src="./images/down2.png" class="last-handel">
                        <i class="fa fa-heart"></i>
                        <div class="drop">
                            <div>Single</div>
                            <div>Married</div>
                            <div>Widower</div>
                            <div>Divorced</div>
                        </div>
                    </div>
                    <input type="text" value="${patientSeconderyData.allergies ? patientSeconderyData.allergies : ""}" placeholder="Allergies">
                    <div class="blood">
                        <span class="last-handel">${patientSeconderyData.blood ? patientSeconderyData.blood : "Blood"}</span>
                        <img src="./images/down2.png" class="last-handel">
                        <i class="fa fa-syringe"></i>
                        <div class="drop">
                            <div>A</div>
                            <div>B</div>
                            <div>AB</div>
                            <div>O</div>
                        </div>
                    </div>
                    <button>Save</button>
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom">
        <h3>Change Password</h3>
        <div>
            <input type="password" placeholder="Current password">
            <div>
                <span class="to-show">
                    <i class="fa-regular fa-eye-slash"></i>
                </span>
                <span class="to-hide">
                    <i class="fa-regular fa-eye"></i>
                </span>
            </div>
        </div>
        <div>
            <input type="password" placeholder="New password">
            <div>
                <span class="to-show">
                    <i class="fa-regular fa-eye-slash"></i>
                </span>
                <span class="to-hide">
                    <i class="fa-regular fa-eye"></i>
                </span>
            </div>
        </div>
        <div>
            <input type="password" placeholder="Confirm password">
            <div>
                <span class="to-show">
                    <i class="fa-regular fa-eye-slash"></i>
                </span>
                <span class="to-hide">
                    <i class="fa-regular fa-eye"></i>
                </span>
            </div>
        </div>
        <button>Save</button>
        <div class="spinner"></div>
    </div>
`);

let clickToOpen = Array.from([document.querySelector(".content .controling img:last-of-type"), document.querySelector(".content2 .top .right .box .left2 .smoking"), document.querySelector(".content2 .top .right .box .right2 .status"), document.querySelector(".content2 .top .right .box .right2 .blood")]);
let opening = Array.from([document.querySelector(".content .controling div"), Array.from(document.querySelectorAll(".content2 .top .right .box .drop"))]).flat();
let openVars = Array(4).fill(0);
let [fisrtOpen, secondOpen, thirdOpen, fourthOpen] = openVars;
for (i = 0; i < 4; i++) {
    clickToOpen[i].onclick = function() {
        let eleIndex = clickToOpen.indexOf(this);
        if (openVars[eleIndex] == 0) {
            for (j = 0; j < 4; j++) {
                opening[j].style.display = "none";
                openVars[j] = 0
            }
            opening[eleIndex].style.display = "block";
            openVars[eleIndex] = 1
        }
        else {
            opening[eleIndex].style.display = "none";
            openVars[eleIndex] = 0
        }
    }
}
let html = document.querySelector("html");
html.addEventListener("click", function(e) {
    for (i = 0; i < 4; i++) {
        if (!e.target.classList.contains("dots") && !e.target.classList.contains("account") && !e.target.classList.contains("smoking") && !e.target.classList.contains("last-handel") && !e.target.classList.contains("status") && !e.target.classList.contains("blood") && openVars[i] == 1) {
            opening[i].style.display = "none";
            openVars[i] = 0;
        }
    }
})

document.querySelector(".content .controling div span:last-of-type").onclick = function() {
    over.style.display = "block";
    window.scroll(0, 0);
    sure.style.display = "block";
    html.style.overflow = "hidden";
}

let drops = document.querySelectorAll(".content2 .top .right .box .drop");
for (i = 0; i < 3; i++) {
    for (j = 0; j < drops[i].children.length; j++) {
        drops[i].children[j].onclick = (e) => e.target.parentElement.parentElement.children[0].innerHTML = e.target.innerHTML
    }
}

let updatedPatientData = {};
let updatePatientDataSpinner = document.querySelector(".content2 .top .right .box .right2 .spinner");
document.querySelector(".content2 .top .right .box .right2 button").onclick = function() {
    updatePatientDataSpinner.style.display = "block";
    updatedPatientData = {
        "userName": document.querySelector(".content2 .top .right .box .left2 input:first-of-type").value,
        "height": document.querySelector(".content2 .top .right .box .left2 .calc input:first-of-type").value,
        "weight": document.querySelector(".content2 .top .right .box .left2 .calc input:last-of-type").value,
        "smoking": document.querySelector(".content2 .top .right .box .left2 .smoking span").innerHTML,
        "maritalstatus": document.querySelector(".content2 .top .right .box .right2 .status span").innerHTML,
        "allergies": document.querySelector(".content2 .top .right .box .right2 input").value, 
        "blood": document.querySelector(".content2 .top .right .box .right2 .blood span").innerHTML,
    }
    fetch(`${domain}/user/account/profile/${patientMainData.userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${patientMainData.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPatientData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty('errors')) {
            alert(data.errors[0].msg);
            updatePatientDataSpinner.style.display = "none";
        }
        else {
            alert(data.message);
            fetch(`${domain}/user/account/profile/${patientMainData.userId}`, {
                headers: {
                    'Authorization': `Bearer ${patientMainData.token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("patientSeconderyData", JSON.stringify(data));
                location.href = "patientProfForHimself.html";
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    })
    .catch(error => {
        console.error('Request failed:', error);
    });
}

let changePasswordSpinner = document.querySelector(".content2 .bottom .spinner");
let newAndConfirmPass = {};
document.querySelector(".content2 .bottom button").onclick = function() {
    changePasswordSpinner.style.display = "block";
    newAndConfirmPass = {
        "password": document.querySelector(".content2 .bottom div:nth-of-type(2) input").value,
        "confirmPassword" : document.querySelector(".content2 .bottom div:nth-of-type(3) input").value
    }
    fetch(`${domain}/user/account/changePassword/${patientMainData.userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${patientMainData.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAndConfirmPass)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);    
        changePasswordSpinner.style.display = "none";
        if (!data.hasOwnProperty("status")) {
            location.href = "patientProfForHimself.html";
        }
    })
    .catch(error => {
        console.error(error);
    });
}