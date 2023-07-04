let patient = {
    medication: ["Acetaminophen", "Ibuprofen", "Aspirin", "Amoxicillin", "Metformin", "Lisinopril", "Atorvastatin", "Prozac", "Albuterol", "EpiPen"]
}

let patientMainData = JSON.parse(localStorage.getItem("patientMainData"));
function fetchData() {
    fetch(`${domain}/user/account/profile/${patientMainData.userId}`, {
        headers: {
            'Authorization': `Bearer ${patientMainData.token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('overlay').classList.add('hide-overlay');
        document.querySelector("html").style.overflow = "auto";
        window.scrollTo(0, 0);
        localStorage.setItem("patientSeconderyData", JSON.stringify(data));
        //rendering the left box which contains some main details about patient
        document.querySelector(".parent .content .left div").innerHTML = (`
            <h4>Personal information</h4>
            <img src="../images/user.png">
            <h5>${data.userName}</h5>
            <h6>Phone number</h6>
            <span>Hasn’t Been Set Yet!</span>
            <h6>Address</h6>
            <span>Hasn’t Been Set Yet!</span>
            <h6>Email</h6>
            <span>${data.email}</span>
        `);
        //rendering about half of the top part of the big box 
        document.querySelector(".parent .content .right .left2 .main").innerHTML = (`
            <div class="first">
                <div>
                    <h4>Gender</h4>
                    <span>unset!</span>
                </div>
                <div>
                    <h4>Marital Status</h4>
                    <span>${data.maritalstatus && data.maritalstatus != "Marital Status" ? data.maritalstatus : "unset!"}</span>
                </div>
                <div>
                    <h4>Weight</h4>
                    <span>${data.weight ? data.weight + " kg" : "unset!"}</span>
                </div>
                <div>
                    <h4>Height</h4>
                    <span>${data.height ? data.height + " cm" : "unset!"}</span>
                </div>
            </div>
            <div class="second">
                <div>
                    <h4>Blood</h4>
                    <span>${data.blood && data.blood != "Blood" ? data.blood : "unset!"}</span>
                </div>
                <div>
                    <h4>Age</h4>
                    <span>${data.birthDate ? data.birthDate : "unset!"}</span>
                </div>
                <div>
                    <h4>Smoking</h4>
                    <span>${data.smoking && data.smoking != "Smoking" ? data.smoking : "unset!"}</span>
                </div>
                <div>
                    <h4>Allergies</h4>
                    <span>${data.allergies ? data.allergies : "unset!"}</span>
                </div>
            </div>
        `);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
window.addEventListener('load', fetchData);

//rendering the appointments the patient has
fetch(`${domain}/user/reservation/${patientMainData.userId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${patientMainData.token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(patientAppoints => {
    function getOngoingAndAvailable(objects) {
        const now = new Date();
        const availableEvents = [];
        const ongoingEvents = [];
        objects.forEach(object => {
            const dateParts = object.time.split('-');
            const timeParts = object.start.split(/:| /);
            let hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const meridian = timeParts[2].toLowerCase();
            if (meridian === 'pm' && hours !== 12) {
                hours += 12;
            } 
            else if (meridian === 'am' && hours === 12) {
                hours = 0;
            }
            const eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes);
            if (eventDate > now) {
                availableEvents.push({ ...object, eventDate });
            } 
            else if ((now - eventDate) <= 30 * 60000) {
                ongoingEvents.push({ ...object, eventDate });
            }
        });
        const sortedEvents = [...ongoingEvents, ...availableEvents].sort((a, b) => {
            if (a.eventDate < b.eventDate) {
                return -1;
            } else if (a.eventDate > b.eventDate) {
                return 1;
            } else {
                return a.start.localeCompare(b.start);
            }
        });
        return sortedEvents;
    }
    const sortedEvents = getOngoingAndAvailable(patientAppoints);
    for (i = 0; i < sortedEvents.length; i++) {
        let appon = document.createElement("div");
        appon.classList.add("appon");
        if (i == sortedEvents.length - 1 && sortedEvents.length != 1) {
            appon.style.cssText = "padding-bottom: 5px"
        }
        const date = new Date(`${sortedEvents[i].time}`);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        const inputTime = sortedEvents[i].start;
        const date2 = new Date();
        date2.setHours(Number(inputTime.split(':')[0]));
        date2.setMinutes(Number(inputTime.split(':')[1].split(' ')[0]));
        const formattedTime = date2.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const timeWithPM = formattedTime.replace(/(am|pm)/i, 'PM');
        appon.innerHTML = (`
            <div>
                <img src="./images/dot.png">
                <h5>Dr ${sortedEvents[i].doctor.userName}</h5>
                <a href="https://genius0x1.github.io/camera/DocBookVideoAndChat.html" target="_blank">
                    <i class="fa-solid fa-video"></i>
                </a>
            </div>
            <div>
                <span>${formattedDate}</span>
                <span>${timeWithPM}</span>
            </div>
        `);
        document.querySelector(".parent .content .right .left2 .appons_notes .appons").appendChild(appon);
    }
})
.catch(error => {
    console.error(error);
});

fetch(`${domain}/Notes/${patientMainData.userId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${patientMainData.token}`,
    },
})
.then(response => response.json())
.then(data => {
    console.log(data.notes);
    //rendering the notes the patient has
    for (i = 0; i < data.notes.length; i++) {
        let note = document.createElement("div");
        note.classList.add("note");
        note.innerHTML = (`
            <div>
                <p>${data.notes[i].content}</p>
            </div>
            <span>
                <img src="./images/note2.png">
                <span>DR. ${data.notes[i].doctor.userName}</span>
            </span>
        `);
        document.querySelector(".parent .content .right .left2 .appons_notes .notes").appendChild(note);
    }
})
.catch(error => {
    console.error(error);
});

document.querySelector(".parent .content .left button").onclick = () => location.href = "editProfile.html"; 

let tempMedication = patient.medication;
let alls = document.querySelector(".parent .content .right .right2 .outer3 .medication .alls");
let renderMedication = function() {
    for (i = 0; i < tempMedication.length; i++) {
        let div = document.createElement("div");
        div.classList.add("all");
        div.innerHTML = (`
            <div>
                <img src="./images/dot.png">
                <span>${tempMedication[i]}</span>
            </div>
            <span class="handel">
                <i class="fa fa-trash-can"></i>
            </span>
        `);
        alls.appendChild(div);
    }
    let trashButtons = Array.from(document.querySelectorAll(".parent .content .right .right2 .medication .all .handel"));
    for (i = 0; i < tempMedication.length; i++) {
        trashButtons[i].onclick = function() {
            while (alls.firstChild) {
                alls.firstChild.remove(); 
            }
            tempMedication.splice(trashButtons.indexOf(this), 1);
            renderMedication();
        }
    }
}
renderMedication();

let body = document.querySelector("body")
let adding = document.querySelector(".adding")
let over = document.querySelector(".over");
document.querySelector(".parent .content .right .right2 .medication .head span").onclick = function() {
    window.scrollTo(0, 0);
    body.style.overflow = "hidden";
    adding.style.display = "block";
    over.style.display = "block";
}

let addingInput = document.querySelector(".adding input");
document.querySelector(".adding div button:first-of-type").onclick = function() {
    if (addingInput.value == "") {
        alert("Cannot be blank!");
    }
    else {
        while (alls.firstChild) {
            alls.firstChild.remove(); 
        }
        tempMedication.push(addingInput.value);
        body.style.overflow = "auto";
        adding.style.display = "none";
        over.style.display = "none";
        addingInput.value= "";
        renderMedication();
    }
}

let clickToHide = [document.querySelector(".adding div button:last-of-type"), over];
for (i = 0; i < 2; i++) {
    clickToHide[i].onclick = function() {
        body.style.overflow = "auto";
        adding.style.display = "none";
        over.style.display = "none";
        addingInput.value= "";
    }
}