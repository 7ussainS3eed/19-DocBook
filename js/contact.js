let inputs = document.querySelectorAll(".parent .content .first form input");
let submitSpinner = document.querySelector(".parent .content .first .spinner");
document.querySelector(".parent .content .first form").addEventListener("submit", function(e) {
    submitSpinner.style.display = "block";
    e.preventDefault();
    fetch(`${domain}/contactus`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userName": inputs[0].value,
            "email": inputs[1].value,
            "details": document.querySelector(".parent .content .first form textarea").value
        })
    })
    .then(response => response.json())
    .then(data => {
        submitSpinner.style.display = "none";
        swal(data.message)
        .then(() => {
            location.reload();
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});