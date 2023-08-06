document.querySelector(".back").onclick = () => location.href = "index.html";

const fileInput = document.getElementById('upload');
let results = document.querySelectorAll(".result");
let over = document.querySelector(".over");
let toRefresh = [over, ...document.querySelectorAll(".result button")];
for (i = 0; i < 3; i++) {
    toRefresh[i].onclick = () => location.reload(); 
}

let mriSpinner = document.querySelector(".parent .content .content2 .spinner");
let html = document.querySelector("html");
function handleFileUpload(event) {
    mriSpinner.style.display = "block"
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    fetch('https://e2ad-197-54-57-204.ngrok-free.app/scan_tumor', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        mriSpinner .style.display = "none"
        over.style.display = "block";
        window.scrollTo(0, 0);
        html.style.overflow = "hidden";
        if (data.prediction == "no") {
            results[0].style.display = "block";
        }
        else {
            results[1].style.display = "block"
        }
    })
    .catch(() => {
        swal("Error!");
    });
}
fileInput.addEventListener('change', handleFileUpload);

$(document).ready(function() {
    var sources = [
        '../images/ad2.jpg', 
        '../images/ad4.jpg', 
        '../images/ad5.jpg', 
        '../images/ad7.jpg', 
        '../images/ad9.jpg', 
        "../images/ad13.png",
        "../images/ad14.jpg",
        "../images/ad16.png"
    ];
    var links = [
        'https://play.google.com/store/apps/details?id=com.seifonline.pharmacy&hl=ar&gl=US', 
        'https://www.al-dawaa.com/', 
        'https://elezabypharmacy.com/ar/home/', 
        'https://19989.tel/w/eHotline', 
        'https://chefaa.com/eg-ar/now', 
        "https://albarqlab.com/ar/?fbclid=IwAR3SOllu5IJeG_HPXXb6C46jAWai2palD567tVkj1mGCvrA1t51yMqWCTaU",
        "https://www.facebook.com/LabmedEgypt",
        "http://www.saridarlab.com/?fbclid=IwAR0CLn_7oPvFo3K0Obr6Y-keQyLtCxbTLZ7k1IBjgFZVOe6exeEYMR5tZuA"
    ];
    var currentIndex;
    var timer;
    function changeImage() {
        var newIndex = Math.floor(Math.random() * sources.length);
        if (newIndex === currentIndex) {
            changeImage();
            return;
        }
        currentIndex = newIndex;
        var imageUrl = sources[currentIndex];
        $('#advertise-image').attr('src', imageUrl);
    }
    function startTimer() {
        timer = setInterval(changeImage, 4000);
    }
    function stopTimer() {
        clearInterval(timer);
    }
    $('.advertise-box').click(function() {
        var linkUrl = links[currentIndex];
        window.open(linkUrl);
    });
    currentIndex = Math.floor(Math.random() * sources.length);
    changeImage();
    startTimer();
    $('.advertise-box').hover(
        function() {
            stopTimer();
            $(this).find('#advertise-image').css({
                'transform': 'scale(1.1) rotate(-1deg)',
                'filter': 'contrast(1.5)',
                'transition': 'all 0.5s ease'
            });
        },
        function() {
            startTimer();
            $(this).find('#advertise-image').css({
                'transform': 'scale(1) rotate(0deg)',
                'filter': 'contrast(1)'
            });
        }
    );
});