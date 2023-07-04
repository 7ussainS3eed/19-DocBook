let inputs = document.querySelectorAll(".parent .content .first form input");
document.querySelector(".parent .content .first form").addEventListener("submit", function(e) {
    document.querySelector(".parent .content .first .spinner").style.display = "block";
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
        alert(data.message);
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
});