document.querySelector(".are2").innerHTML = (`
    <h4>Are you ?</h4>
    <div>
        <button>Patient</button>
        <span>Or</span>
        <button>Doctor</button>
    </div>
`);

document.querySelector(".are").innerHTML = (`
    <h4>Are you ?</h4>
    <div>
        <button>Patient</button>
        <span>Or</span>
        <button>Doctor</button>
    </div>
`);

document.querySelector(".sign-in").innerHTML = (`
    <h4>Welcome Back</h4>
    <p>Login Your Account</p>
    <form>
        <label>E-mail</label>
        <input type="email">
        <label>Password</label>
        <input type="password">
        <input type="submit" value="Log In">
        <div class="spinner"></div>
    </form>
    <p>
        Don't have an account?
        <a href="#">Create One</a>
    </p>
`);
let spinnerSignIn = document.querySelector(".spinner");
spinnerSignIn.style.cssText = "top: 408px; right: 275px; display: none";

function display(val, ...eles) {
    for (const ele of eles) {
        ele.style.display = val;
    }
}
let are2 = document.querySelector(".are2")
let over = document.querySelector(".over");
let html = document.querySelector("html");
document.querySelector("header .content .buttons p").onclick = function() {
    window.scrollTo(0, 0);
    display("block", are2, over);
    html.style.overflow = "hidden";
}

let roleButtons = document.querySelectorAll(".are2 div button");
let signIn = document.querySelector(".sign-in");
let roleChoise = 0;
if (document.title == "Patient Sign Up | DocBook") {
    roleChoise = 0;
}
else if (document.title == "Doctor Sign Up | DocBook") {
    roleChoise = 1;
}
else if (document.title == "Admin LogIn | DocBook") {
    roleChoise = 2;
}
for (i = 0; i < 2; i++) {
    roleButtons[i].onclick = function() {
        display("none", are2);
        display("block", signIn);
        roleChoise = Array.prototype.indexOf.call(roleButtons, this);
    }
}

let are = document.querySelector(".are");
over.onclick = function() {
    display("none", signIn, are, are2, over);
    html.style.overflow = "auto";
}

let endPoints = ["loginUser", "loginDoctor", "loginAdmin"];
let signInInputs = document.querySelectorAll(".sign-in form input");
let signInData = {};
for (i = 0; i < 2; i++) {
    signInInputs[i].oninput = function() {
        signInData = {
            "email": signInInputs[0].value,
            "password": signInInputs[1].value
        }
    }
}

document.querySelector(".sign-in form").addEventListener("submit", function(e) {
    e.preventDefault();
    if (signInInputs[0].value == "" || signInInputs[1].value == "") {
        swal("Can not be blank!");
        return;
    }
    spinnerSignIn.style.display = "block";
    fetch(`${domain}/auth/${endPoints[roleChoise]}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(signInData)
    })
    .then(response => response.json())
    .then(responseData => {
        if (!responseData.hasOwnProperty('token')) {
            swal(responseData.message)
            spinnerSignIn.style.display = "none";
        }
        else {
            if (roleChoise == 0) {
                localStorage.setItem("patientMainData", JSON.stringify(responseData));
                location.href = "index.html";
            }
            else if (roleChoise == 2) {
                localStorage.setItem("adminMainData", JSON.stringify(responseData));
                location.href = "admin.html";
            }
            else {
                localStorage.setItem("doctorMainData", JSON.stringify(responseData));
                location.href = "docProfForHimself.html";
            }
        }
    })
    .catch(error => {
        console.error("Error:", error);
    })
});

document.querySelector(".sign-in p a").onclick = function() {
    display("none", signIn);
    display("block", are);
}

document.querySelector("header .content .buttons a").onclick = function() {
    display("block", are, over)
    html.style.overflow = "hidden";
}

let buttons = document.querySelectorAll(".are div button");
buttons[0].onclick = function() {
    location.href = "signUpForPatient.html";
}
buttons[1].onclick = function() {
    location.href = "signUpForDoctor.html";
}