let patientMainData = JSON.parse(localStorage.getItem("patientMainData"));
fetch(`${domain}/doctor/account/profile/${localStorage.getItem("doctorOpenedId")}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${patientMainData.token}`,
    },
})
.then(response => response.json())
.then(doctorOpenedFullData => {
    console.log(doctorOpenedFullData);
    document.getElementById('overlay').classList.add('hide-overlay');
    html.style.overflow = "auto";
    window.scrollTo(0, 0);
    localStorage.setItem("doctorOpenedFullData", JSON.stringify(doctorOpenedFullData));
    document.querySelector(".parent .content .content2 .box").innerHTML = (`
        <img src=${doctorOpenedFullData.photo}>
        <h2>Dr. ${doctorOpenedFullData.userName}</h2>
        <p>${doctorOpenedFullData.specialty ? doctorOpenedFullData.specialty : "Specialty hasn’t been set yet!"}</p>
        <div>Add a complaint</div>
    `);
    document.querySelector(".complaint").innerHTML = (`
        <div>
            <img src="../images/user.png">
            <span>You &nbsp;> &nbsp;Dr.${doctorOpenedFullData.userName}</span>
        </div>
        <textarea placeholder="Complaints details ..........."></textarea>
        <div class="spinner"></div>
        <div>
            <button>Submit</button>
            <button>Cancel</button>
        </div>
    `);
    let complaint = document.querySelector(".complaint");
        document.querySelector(".parent .content .content2 div .box div").onclick = function() {
            window.scrollTo(0, 0);
            display("block", complaint, over);
            html.style.overflow = "hidden";
    }
    let addComplaint = function() {
        document.querySelector(".complaint div:last-of-type button:first-of-type").onclick = function() {
            document.querySelector(".complaint .spinner").style.display = "block";
            fetch(`${domain}/doctor/complaints/${doctorOpenedFullData._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${patientMainData.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "details": document.querySelector(".complaint textarea").value,
                    "user": `${patientMainData._id}`,
                    "doctor": `${doctorOpenedFullData._id}`
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
    }
    addComplaint();
    let toHide = [over, document.querySelector(".complaint div:last-of-type button:last-of-type")];
    for (i = 0; i < 2; i++) {
        toHide[i].onclick = function() {
            display("none", complaint, over);
            html.style.overflow = "auto";
        }
    }
    document.querySelector(".parent .content .content2 .box2").innerHTML = (`
        <h2>About The Doctor</h2>
        <p>${doctorOpenedFullData.aboutme ? doctorOpenedFullData.aboutme : "Hasn’t Been Set Yet!"}</p>
        <h3>Experience</h3>
        <p>${Math.floor(Math.random() * 26) + 5} Years</p>
        <h3>Service</h3>
        <p>${doctorOpenedFullData.price ? doctorOpenedFullData.price + "$" : "Hasn’t Been Set Yet!"}</p>
    `);
    document.querySelector(".reviews").innerHTML = (`
        <h2>Patient Reviews</h2>
        <div>
            <span>${doctorOpenedFullData.raiting.toFixed(1) >= 1 ? doctorOpenedFullData.raiting.toFixed(1) : "Not Yet!"}</span>
            <div class="stars"></div>
        </div>
        <p>${doctorOpenedFullData.numReviews ? "From " + doctorOpenedFullData.numReviews + " Visitor" : ""}</p>
        <div></div>
    `);
    for (i = 0; i < parseInt(doctorOpenedFullData.raiting); i++) {
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
    doctorOpenedFullData.reviews.forEach((review) => {
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
    for (i = 0; i < doctorOpenedFullData.numReviews; i++) {
        let full = document.createElement("div");
        full.classList.add("full");
        if (i == 0) {
            full.style.paddingTop = "0";
        }
        if (i == doctorOpenedFullData.numReviews-1) {
            full.style.cssText = "padding-bottom: 0; border-bottom: none"
        }
        full.innerHTML = (`
            <div>
                <img src="../images/user.png">
                <span>Review ${doctorOpenedFullData.reviews[i]._id.slice(-5)}</span>
            </div>
            <div>
                <div></div>
                <p>${doctorOpenedFullData.reviews[i].comment}</p>
            </div>
        `);
        commentsDiv.appendChild(full);
    }
    for (i = 0; i < doctorOpenedFullData.numReviews; i++) {
        for (j = 0; j < doctorOpenedFullData.reviews[i].rating; j++) {
            let star = document.createElement("img");
            star.setAttribute("src", "./images/rate.png");
            document.querySelectorAll(".comments .full div div")[i].appendChild(star);
        }
    }
})
.catch(error => {
    console.error(error);
});

let clickToRate = document.querySelectorAll(".parent .content .content2 div .box2 + div form div:first-of-type img");
let divClickToRate = document.querySelector(".parent .content .content2 div .box2 + div form div:first-of-type");
let divRate = document.querySelector(".parent .content .content2 div .box2 + div form div:nth-of-type(2)");
let ratingReseter = document.querySelector("aside");
let rateH5 = document.querySelector(".parent .content .content2 div .box2 + div form h5");
let rating = 0;
for (i = 0; i < 5; i++) {
    clickToRate[i].onclick = function() {
        let index = Array.prototype.indexOf.call(clickToRate, this);
        divClickToRate.style.display = "none";
        divRate.children[index].style.display = "block";
        ratingReseter.style.display = "flex";
        rateH5.style.marginBottom = "8px";
        rating = index + 1;
        console.log(rating);
    }
}

document.querySelector(".parent .content .content2 div .box2 + div form div:last-of-type button").addEventListener("click", function(e) {
    e.preventDefault();
    if (rating == 0) {
        alert("Please choose at least one star!");
    }
    else {
        document.querySelector(".parent .content .content2 div .box2 + div form div:last-of-type .spinner").style.display = "block";
        fetch(`${domain}/doctor/${localStorage.getItem("doctorOpenedId")}/review`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${patientMainData.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    "rating": rating,
                    "comment": document.querySelector(".parent .content .content2 div .box2 + div form textarea").value,
                    "user": patientMainData._id
                }
            )
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
})

ratingReseter.onclick = function() {
    for (i = 0; i < 5; i++) {
        divRate.children[i].style.display = "none";
        divClickToRate.style.display = "flex";
        ratingReseter.style.display = "none";
        rateH5.style.marginBottom = "17.95px";
        rating = 0;
    }
}

function generateObject() {
    const durations = ["30 min", "1 hr"];
    const duration = durations[Math.floor(Math.random() * durations.length)];
    const takenLength = Math.floor(Math.random() * 4) + 3;
    const taken = [];
    while (taken.length < takenLength) {
        const randomNumber = Math.floor(Math.random() * 16);
        if (!taken.includes(randomNumber)) {
            taken.push(randomNumber);
        }
    }
    const object = {
        duration: duration,
        taken: taken
    };
    return object;
}
const doctor = generateObject();
console.log(doctor);

let times = ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"]
let bookButton = document.querySelector(".parent .content .content2 div .book")
let dropMenu = document.querySelector(".wrapper .dropMenu")
for (i = 0; i < 16; i++) {
    let time = document.createElement("span")
    if (doctor.duration == "1 hr" && i%2!=0) {
        $(time).addClass("duration")
    }
    for (j = 0; j < doctor.taken.length; j++) {
        if (i == doctor.taken[j]) {
            time.classList.add("cannot");
        }
    }
    time.innerHTML = times[i];
    time.onclick = function() {
        if (time.classList.contains("duration") == 0 && time.classList.contains("cannot") == 0) {
            bookButton.style.display = "block"
            bookButton.innerHTML = (`
                Book (${prefinalResult} at ${this.innerHTML})
            `)
            $(bookButton).addClass("fade-in")
            setTimeout(() => {
                $(bookButton).removeClass("fade-in")
            }, 1000);
            localStorage.setItem("dateAndTimePicked", `${prefinalResult} at ${this.innerHTML}`)
        }
        /*bookButton.innerHTML = (`
            Book (${prefinalResult} at ${this.innerHTML})
        `)*/
    }
    dropMenu.appendChild(time)
}

document.querySelector(".parent .content .content2 div .book").onclick = () => location.href = "confirm.html";