var today = new Date().toISOString().split('T')[0];
document.getElementById("birthDate").setAttribute("max", today);

let signUpPatientInputs = document.querySelectorAll(".parent .content .content3 form input");
let signUpPatientData = {};
for (i = 0; i < 5; i++) {
    signUpPatientInputs[i].oninput = function() {
        signUpPatientData = {
            "roles": "user",
            "userName": signUpPatientInputs[0].value,
            "email": signUpPatientInputs[1].value,
            "birthDate": signUpPatientInputs[2].value,
            "password": signUpPatientInputs[3].value,
            "confirmPassword": signUpPatientInputs[4].value
        }
    }
}

let spinnerSignUpPatient = document.querySelector(".parent .content .content3 form .spinner")
document.querySelector(".parent .content .content3 form").addEventListener("submit", function(e) {
    e.preventDefault();
    for (i = 0; i < 5; i++) {
        if (signUpPatientInputs[i].value == "") {
            swal("Can not be blank!");
            return;
        }
    }
    spinnerSignUpPatient.style.display = "block";
    fetch(`${domain}/auth/signupUser`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(signUpPatientData)
    })
    .then(response => response.json())
    .then(responseData => {
        swal(responseData.message ? responseData.message : "Error!");
        spinnerSignUpPatient.style.display = "none";
        if (responseData.hasOwnProperty('userId')) {
            location.href = "index.html"
        }
    })
});

document.querySelector(".parent .content .content3 .already a").onclick = function() {
    window.scrollTo(0, 0);
    signIn.style.display = "block";
    over.style.display = "block";
    html.style.overflow = "hidden";
}