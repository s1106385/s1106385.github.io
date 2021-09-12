var isZH = /\/zh\/{1}/.test(window.location.href);

$(document).ready(function(){ 
    $("div.fromcampus").css("left", -$("div.fromcampus").outerWidth());
    $("div.location").css("left", -$("div.location").outerWidth()*2);
    
    $("#location").on("click", function() {
        if (parseInt($("div.location").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.fromcampus").show();
            $("div.location").show();
            $("div.location").animate({
                left: 0
            });
            $("div.fromcampus").animate({
                left: $("div.fromcampus").outerWidth()
            });
            $("div.tocampus").animate({
                left: $("div.tocampus").outerWidth() * 2
            }, function() {
                $("div.tocampus").hide();
                $("div.fromcampus").hide();
            });
        }
    });
    
    $("#from").on("click", function() {
        if (parseInt($("div.fromcampus").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.tocampus").show();
            $("div.fromcampus").show();
            $("div.location").show();
            $("div.location").animate({
                left: -$("div.location").outerWidth()
            });
            $("div.fromcampus").animate({
                left: 0
            });
            $("div.tocampus").animate({
                left: $("div.tocampus").outerWidth()
            }, function() {
                $("div.location").hide();
                $("div.tocampus").hide();
            });
        }
    });
    
    $("#to").on("click", function() {
        if (parseInt($("div.tocampus").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.fromcampus").show();
            $("div.location").show();
            $("div.tocampus").show();
            $("div.location").animate({
                left: -$("div.location").outerWidth() * 2
            });
            $("div.fromcampus").animate({
                left: -$("div.fromcampus").outerWidth()
            });
            $("div.tocampus").animate({
                left: 0
            }, function() {
                $("div.location").hide();
                $("div.fromcampus").hide();
            });
        }
    });
});