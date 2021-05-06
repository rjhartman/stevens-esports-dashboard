
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
// $(".category").click(function(event){
//     let game = $(this).val();
//     // alert(game);
// });