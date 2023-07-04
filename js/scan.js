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
    fetch('https://453d-197-54-18-125.ngrok-free.app/scan_tumor', {
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
    .catch(error => {
        console.error(error);
    });
}
fileInput.addEventListener('change', handleFileUpload);