let doctors = [
    {
        image: "./images/sara.jpg",
        name: "Sara William",
        description: "Consultant specializing in children and newborns",
        rate: 4,
        views: 1324,
        wait: 20,
        price: 150,
        calls: 100
    },
    {
        image: "./images/harry.jpg",
        name: "Harry Nelson",
        description: "Consultant ENT",
        rate: 5,
        views: 1524,
        wait: 25,
        price: 130,
        calls: 85
    },
    {
        image: "./images/moly.jpg",
        name: "Moly Watson",
        description: "Consultant of Dermatology and Andrology",
        rate: 5,
        views: 2324,
        wait: 30,
        price: 170,
        calls: 80
    },
    {
        image: "./images/moly.jpg",
        name: "Moly Watson",
        description: "Consultant of Dermatology and Andrology",
        rate: 5,
        views: 2324,
        wait: 30,
        price: 170,
        calls: 80
    }
];

let getDoctorsPreInfo = function() {
    fetch(`${domain}/admin/accepted-doctors`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(doctorsPreInfo => {
        localStorage.setItem("doctorsPreInfo", JSON.stringify(doctorsPreInfo.data));
        //rendering the doctors' boxes shown in the slider
        var waitingOptions = [10, 15, 20, 25, 30];
        for (i = 0; i < doctorsPreInfo.data.length; i++) {
            let box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = (`
                <img src="${doctorsPreInfo.data[i].photo}" class="profile">
                <h5>Dr. ${doctorsPreInfo.data[i].userName}</h5>
                <p class="descr">${doctorsPreInfo.data[i].specialty ? doctorsPreInfo.data[i].specialty : "Specialty hasn’t been set yet!"}</p>
                <div class="count">
                    <div>
                        ${doctorsPreInfo.data[i].raiting != 0 ? `<img src="./images/rate.png"><span>${doctorsPreInfo.data[i].raiting.toFixed(1)}</span>` : `<span>No Ratings Yet!</span>`}
                    </div>
                </div>
                <div class="information">
                    <div>
                        <img src="./images/time.png"><span>Waiting Time</span><span>${waitingOptions[Math.floor(Math.random() * waitingOptions.length)]} Minute</span>
                    </div>
                    <div>
                        <img src="./images/video3.png"><span>Video Calls</span><span>${Math.floor(Math.random() * 3)} Call</span>
                    </div>
                </div>
                <button>Discover Available Appointments</button>
            `);
            document.querySelector(".distinguished .content .parent").appendChild(box);
        }
        let bottomCounter = document.querySelector(".distinguished .content .parent + span");
        bottomCounter.innerHTML = (`1 of ${doctorsPreInfo.data.length - 2}`);
        //handeling everything about the slider
        let slider2 = document.querySelector(".distinguished .content .slider2");
        if (doctorsPreInfo.data.length <= 3) {
            slider2.style.cssText = "opacity: 0.4; cursor: not-allowed";
            document.querySelector(".distinguished .content .parent").style.justifyContent = "flex-start";
        }
        else {
            let parent = document.querySelector(".distinguished .content .parent");
            let slider1 = document.querySelector(".distinguished .content .slider1");
            let counter = 1;
            slider2.onclick = function() {
                parent.scroll({
                    left: parent.scrollLeft + 340,
                    behavior: "smooth"
                });
                slider1.style.cssText = "opacity: 1; cursor: pointer";
                counter == doctorsPreInfo.data.length - 2 ? counter-- : null;
                counter++;
                counter == doctorsPreInfo.data.length - 2 ? slider2.style.cssText = "opacity: 0.4; cursor: not-allowed" : null 
                bottomCounter.innerHTML = (`${counter} of ${doctorsPreInfo.data.length - 2}`);
            }
            slider1.onclick = function() {
                parent.scroll({
                    left: parent.scrollLeft - 340,
                    behavior: "smooth"
                });
                slider2.style.cssText = "opacity: 1; cursor: pointer";
                counter == 1 ? counter++ : null;
                counter--;
                counter == 1 ? slider1.style.cssText = "opacity: 0.4; cursor: not-allowed" : null;
                bottomCounter.innerHTML = (`${counter} of ${doctorsPreInfo.data.length - 2}`);
            }
        }
        document.getElementById('overlay').classList.add('hide-overlay');
        html.style.overflow = "auto";
        window.scrollTo(0, 0);
        const mustLogIn = Array.from(Array.from(document.querySelectorAll(".landing div button")).concat(Array.from(document.querySelectorAll(".specialties .content .parent div")), Array.from(document.querySelectorAll(".distinguished .content .parent .box button"))));
        for (i = 0; i < mustLogIn.length; i++) {
            mustLogIn[i].onclick = function() {
                if (!localStorage.getItem("patientMainData")) {
                    over.style.display = "block";
                    window.scrollTo(0, 0);
                    html.style.overflow = "hidden";
                    signIn.style.display = "block";
                }
                else {
                    let index = Array.prototype.indexOf.call(mustLogIn, this);
                    if (index <= 7) {
                        location.href = "doctors.html";
                    }
                    else {
                        localStorage.setItem("doctorOpenedId", doctorsPreInfo.data[index-8]._id);
                        location.href = "docProfForPatient.html";
                    }
                }
            }
        }
    })
    .catch(error => {
        console.error(error);
    });
}
getDoctorsPreInfo();

document.querySelector(".new .content .box div button").onclick = () => location.href = "scan.html";