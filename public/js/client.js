function dropdown() {
    document.getElementById("team-list").classList.toggle("show");
}

window.onclick = function(e) {
    if(!e.target.matches('.dropdownButton')){
        let dropdown = document.getElementById("team-list");
        if(dropdown.classList.contains("show"))
            dropdown.classList.remove("show");
    }
}

$(document).ready(function () {
    $(".resolved_matches").css("display","none");
    $(".unresolved_matches").css("display","block");
    // alert('hi');
    
});
$(".results").click(function(event){
    $(".resolved_matches").css("display","block");
    $(".unresolved_matches").css("display","none");
});
$(".upcoming").click(function(event){
    $(".resolved_matches").css("display","none");
    $(".unresolved_matches").css("display","block");
});