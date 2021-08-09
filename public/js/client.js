$(document).ready(function () {
    $(".resolved_matches").css("display","none");
    $(".unresolved_matches").css("display","block");
    // alert('hi');
    
});
$("#results").click(function(event){
    $(".resolved_matches").show();
    $("#results").css("background-color", "rgb(204, 29, 29)");
    $("#results").css("color", "white");
    $("#upcoming").css("background-color", "white");
    $("#upcoming").css("color", "rgb(204, 29, 29)");
    $(".unresolved_matches").hide();
});
$("#upcoming").click(function(event){
    $(".resolved_matches").hide();
    $("#upcoming").css("background-color", "rgb(204, 29, 29)");
    $("#upcoming").css("color", "white");
    $("#results").css("background-color", "white");
    $("#results").css("color", "rgb(204, 29, 29)");
    $(".unresolved_matches").show();
});


// Pop-up window
var modal = document.getElementById("deleteWindow");
var btn = document.getElementById("delete");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if(event.target == modal)
        modal.style.display = "none";
}