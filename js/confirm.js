document.querySelector(".back").onclick = () => location.href = "doctors.html";

//rendering the left box which contains some information about doctor and time the patient going to book at
let doctorOpenedFullData = JSON.parse(localStorage.getItem("doctorOpenedFullData"));
document.querySelector(".parent .content .content2 .box").innerHTML = (`
    <img src="${doctorOpenedFullData.photo}">
    <h5>Dr. ${doctorOpenedFullData.userName}</h5>
    <p>${doctorOpenedFullData.specialty ? doctorOpenedFullData.specialty : "Cardiology (Heart)"}</p>
    <p>${localStorage.getItem("dateAndTimePicked")}</p>
`);

var today = new Date();
today.setMonth(today.getMonth() + 1);
var month = (today.getMonth() + 1).toString().padStart(2, '0');
var year = today.getFullYear().toString();
var minDate = year + '-' + month;
document.getElementById('monthYearInput').min = minDate;

let inputs = document.querySelectorAll(".parent .content .content2 .box2 form input");
let over = document.querySelector(".over");
let html = document.querySelector("html");
let done = document.querySelector(".done");
document.querySelector(".parent .content .content2 .box2 form input:nth-of-type(7)").addEventListener("click", function(e){
    e.preventDefault();
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].value == "") {
            swal("Can not be blank!");
            return;
        }
    }
    let cardNumber = inputs[3].value;
    if (cardNumber.length !== 14 || isNaN(cardNumber)) {
        swal("Please enter a valid 14-digit card number!");
        return;
    }
    let date = inputs[4].value;
    let year = date.slice(0, 4);
    let month = date.slice(5);
    let convertedDate = month + '/' + year.slice(2);
    let cvvRegex = /^[0-9]{3}$/;
    if (!cvvRegex.test(inputs[5].value)) {
        swal("Please enter a valid 3-digit CVV!");
        return;
    }
    document.querySelector(".parent .content .content2 .box2 form .spinner").style.display = "block";
    let patientMainData = JSON.parse(localStorage.getItem("patientMainData"));
    var dateObj = moment(localStorage.getItem("dateAndTimePicked"), "DD MMMM YYYY [at] hh:mm A");
    var datePart = dateObj.format("YYYY-MM-DD");
    var timePart = dateObj.format("hh:mm") + "pm";
    fetch(`${domain}/createReservation`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${patientMainData.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "time": datePart,
            "start": timePart,
            "patient": patientMainData.userId,
            "doctor": doctorOpenedFullData._id,
            "cardnumber": inputs[3].value,
            "securitycode": inputs[5].value,
            "expiration": convertedDate
        })
    })
    .then(response => response.json())
    .then(() => {
        over.style.display = "block";
        window.scrollTo(0, 0);
        html.style.overflow = "hidden";
        done.style.display = "flex";
    })
    .catch(error => {
        console.error(error);
    });
});

document.querySelector(".parent .content .content2 .box2 form button").addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "doctors.html";
})
document.querySelector(".done button").onclick = () => location.href = "patientProfForHimself.html";