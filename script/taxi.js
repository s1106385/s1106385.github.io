var isZH = /\/zh\/{1}/.test(window.location.href);

function twoDigit(number) {
    if(number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

$(document).ready(function(){
    $.post("http://kmb192006.byethost12.com/parser.php", { function : "getRegIDs"}, function(data) {
        
        $("#result").html(data);
    }, "json");
});