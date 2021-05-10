function dropdown() {
    document.getElementById("team-list").classList.toggle("show");
}

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

window.onclick = function(e) {
    if(!e.target.matches('.dropdownButton')){
        let dropdown = document.getElementById("team-list");
        if(dropdown.classList.contains("show"))
            dropdown.classList.remove("show");
    }
}