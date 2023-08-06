let getDoctorsPreInfo = function() {
    fetch(`${domain}/admin/accepted-doctors-new`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(doctorsPreInfo => {
        localStorage.setItem("doctorsPreInfo", JSON.stringify(doctorsPreInfo.data));
        for (i = 0; i < doctorsPreInfo.data.length; i++) {
            let box = document.createElement("div");
            box.classList.add("box");
            box.innerHTML = (`
                <img src="${doctorsPreInfo.data[i].photo}" class="profile">
                <h5>Dr. ${doctorsPreInfo.data[i].userName}</h5>
                <p class="descr">${doctorsPreInfo.data[i].specialty ? doctorsPreInfo.data[i].specialty : "Cardiology (Heart)"}</p>
                <div class="count">
                    <div>
                        ${doctorsPreInfo.data[i].raiting != 0 ? `<i class="fa-solid fa-star"></i></i><span>${doctorsPreInfo.data[i].raiting.toFixed(1)}</span>` : `<span>No Ratings Yet!</span>`}
                    </div>
                </div>
                <div class="information">
                    <div>
                        <i class="fa-solid fa-star"></i></i><span>Reviews</span><span>${doctorsPreInfo.data[i].numReviews} Review</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-money-check-dollar"></i><span>Detection Price</span><span>${doctorsPreInfo.data[i].price}$</span>
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
                        localStorage.setItem("doctorOpenedProfFrom", "index.html")
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