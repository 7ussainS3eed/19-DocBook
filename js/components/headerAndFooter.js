let defaultpatientImage = "images/user.png";
document.querySelector("header").innerHTML = (`
    <div class="content">
        <a href="index.html" class="logo">DocBook</a>
        <div class="control">
            <div class="pages">
                <a href="index.html" class="active">Home</a>
                <a href="#">Clinics</a>
                <a href="contact.html">Contact us</a>
            </div>
            <div class="buttons">
                <p>Login</p>
                <a href="#">Sign Up</a>
                <img src="${defaultpatientImage}" class="prof">
                <div class="drop">
                    <span>View profile</span>
                    <span>Log out</span>
                </div>
            </div>
        </div>
    </div>
`);

let prof = document.querySelector("header .content .control .buttons .prof");
if (localStorage.getItem("patientMainData")) {
    document.querySelector("header .content .control .buttons p").style.display = "none";
    document.querySelector("header .content .control .buttons a").style.display = "none";
    prof.style.display = "block";
}

let drop = document.querySelector(".drop");
let opened = 0;
prof.onclick = function() {
    if (opened == 0) {
        drop.style.display = "flex";
        opened = 1;
    }
    else {
        drop.style.display = "none";
        opened = 0;
    }
}
document.querySelector("body").onclick = function(e) {
    if (e.target.classList.contains("prof") == false && e.target.classList.contains("drop") == false && opened == 1) {
        drop.style.display = "none";
        opened = 0;
    }
}

document.querySelector("header .content .control .buttons .drop span:first-of-type").onclick = function() {
    location.href = "patientProfForHimself.html"
}

document.querySelector("header .content .control .buttons .drop span:last-of-type").onclick = function() {
    localStorage.clear();
    location.href = "index.html";
}

let pages = document.querySelectorAll("header .content .control .pages a");
let changeActive = function(toRemove, toAdd) {
    toRemove.classList.remove("active");
    toAdd.classList.add("active");
}
if (document.title == "DocBook") {
    if (localStorage.getItem("clinicsClicked")) {
        localStorage.removeItem("clinicsClicked");
        setTimeout(() => {
            window.scrollTo(0, 750);
            changeActive(pages[0], pages[1]);
        }, 700);
    }
    pages[1].onclick = function() {
        window.scrollTo(0, 750);
        changeActive(pages[0], pages[1]);
    }
    window.onscroll = function() {
        if(window.scrollY > 104) {
            changeActive(pages[1], pages[0]);
        }
    }
}
else {
    if (document.title == "Contact us | DocBook") {
        changeActive(pages[0], pages[2]);
    }
    pages[1].onclick = function() {
        localStorage.setItem("clinicsClicked", 1);
        location.href = "index.html";
    }
}

document.querySelector(".contact").innerHTML = (`
    <div class="content">
        <div class="doc">
            <h4>DocBook</h4>
            <p>Search, compare and book doctor consultations with ease.</p>
        </div>
        <div class="contact2">
            <h4>Contact us</h4>
            <div class="box">
                <div class="ico">
                    <img src="images/phone2.png">
                </div>
                <p>01015758541</p>
            </div>
            <div class="box">
                <div class="ico">
                    <img src="images/web.png">
                </div>
                <p>www.docbook.com</p>
            </div>
            <div class="box">
                <div class="ico">
                    <img src="images/location.png">
                </div>
                <p>221 Baker street, london- England</p>
            </div>
            <div class="box">
                <div class="ico">
                    <img src="images/mail.png">                    
                </div>
                <p>docbook15@gmail.com</p>
            </div>
        </div>
        <div class="images">
            <h4>Follow us</h4>
            <div>
                <a href="https://www.facebook.com/" target="_blank">
                    <img src="images/face.png">
                </a>
                <a href="https://www.instagram.com/" target="_blank">
                    <img src="images/insta.png">
                </a>
                <a href="https://twitter.com/" target="_blank">
                    <img src="images/twitter.png">
                </a>
            </div>
        </div>
    </div>
`);