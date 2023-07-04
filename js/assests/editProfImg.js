let editProfileImg = function() {
    document.querySelector("#profile").onchange = function() {
        var reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = () => document.querySelector(".profImg").src = reader.result;
        document.querySelector(".buttonss").style.display = "flex";
    }
    
    document.querySelector(".buttonss button:last-of-type").onclick = () => location.reload();
}