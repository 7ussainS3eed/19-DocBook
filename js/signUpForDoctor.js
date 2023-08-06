var today = new Date().toISOString().split('T')[0];
document.getElementById("birthDate").setAttribute("max", today);

let chooseMenuOpened = 0
let chooseMenu = document.querySelector(".choose-menu");
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
let specializationDiv = document.querySelector(".parent .content .right form .spec_sess .spec div div:first-of-type");
document.querySelector(".parent .content .right form .spec_sess .spec > div").onclick = (e) => chooseMenuOpened == 0 ? handelOpenAndClose(1) : chooseMenuOpened == 1 && !e.target.classList.contains("choose-menu") ? handelOpenAndClose(0) : null;
document.querySelector("body").addEventListener("click", (e) => chooseMenuOpened == 1 && !e.target.classList.contains("to-handel") && !e.target.classList.contains("choose-menu") ? handelOpenAndClose(0) : null)
for (i = 0; i < 6; i++) {
    document.querySelectorAll(".choose-li")[i].onclick = (e) => specializationDiv.innerHTML = e.target.innerHTML;
}

let fileInputs = [document.getElementById("photo"), document.getElementById("license")];
let parentDivs = document.querySelectorAll(".parent .content .right form .nation_carner div div");
let toBeFilled = document.querySelectorAll(".parent .content .right form .nation_carner div div span");
for (i = 0; i < 2; i++) {
    fileInputs[i].addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            e.target.style.marginBottom = "5px";
            let index = Array.prototype.indexOf.call(fileInputs, e.target);
            parentDivs[index].style.display = "flex"
            toBeFilled[index].innerHTML = e.target.files[0].name
        }
    });
}

let signUpDoctorSpinner = document.querySelector(".parent .content .right form .spinner");
document.querySelector(".submit").addEventListener("click", function(e) {
    e.preventDefault();
    const originalDate = new Date(document.querySelector("input:nth-of-type(4)").value);
    const year = originalDate.getFullYear();
    const month = String(originalDate.getMonth() + 1).padStart(2, '0');
    const day = String(originalDate.getDate()).padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`;
    if (specializationDiv.textContent == "") {
        swal("Specialization can not be blank!");
        return;
    }
    const inputs = document.querySelectorAll('input');
    if (inputs[9].value == "") {
        swal("Session Price can not be blank!")
        return
    }
    if (window.getComputedStyle(toBeFilled[0]).getPropertyValue('display') == "block" || window.getComputedStyle(toBeFilled[1]).getPropertyValue('display') == "block") {
        signUpDoctorSpinner.style.top = "1037px"
    }
    signUpDoctorSpinner.style.display = "block";
    const formData = new FormData();
    inputs.forEach(input => {
        const name = input.id;
        const value = input.value;
        if (input.type == 'file') {
            const files = input.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                formData.append(name, file);
            }
        }
        else if (input.type == "date") {
            formData.append(name, formattedDate);
        }
        else {
            formData.append(name, value);
        }
    });
    formData.append("Specialization", specializationDiv.textContent);
    const entriesArray = Array.from(formData.entries());
    const newEntriesArray = entriesArray.slice(3);
    const newFormData = new FormData();
    newEntriesArray.forEach(([key, value]) => {
        newFormData.append(key, value);
    });
    fetch(`${domain}/auth/signupDoctor`, {
        method: 'POST',
        body: newFormData
    })
    .then(response => response.json())
    .then(data => {
        if (data.hasOwnProperty('errors')) {
            swal(data["errors"][0].msg);
            signUpDoctorSpinner.style.display = "none";
        }
        else if (data.hasOwnProperty("status")) {
            swal(data.message);
            signUpDoctorSpinner.style.display = "none";
        }
        else {
            document.querySelector(".parent .content .right").innerHTML = (`<h2>Thanks for your time. We will response you soon.</h2>`);
            document.querySelector(".parent .content").style.height = "820px";
            window.scrollTo(0, 0);
        }
    })
    .catch(error => {
        console.error(error);
    });
});

document.querySelector(".parent .content .right p span").onclick = function() {
    window.scrollTo(0, 0);
    signIn.style.display = "block";
    over.style.display = "block";
    html.style.overflow = "hidden";
}