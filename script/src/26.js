fromcampus = [[6,40,10,0],[10,0,16,0],[16,0,20,0],[20,0,23,36]];
tocampus = [[6,40,10,0],[10,0,16,0],[16,0,20,0],[20,0,23,0]];
fromcampus26a = [[7,30,9,30],[17,30,20,30]];
frequency = [8,9,8,9];
frequency26a = 15;
var isZH = /\/zh\/{1}/.test(window.location.href);

function twoDigit(number) {
    if(number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function loadTimetable(route, timetable) {
    appendString = "";
    fminute = 0;
    fhour = 0;
    if (route === "26") {
        if (timetable === "table.gmb26.from") {
            data = fromcampus;
        } else {
            data = tocampus;
        }
    } else {
        data = fromcampus26a;
    } 
    for(i=0; i<data.length; i++) {
        if (route === "26") {
            qty = ((data[i][2]-data[i][0])*60-data[i][1]+data[i][3])/frequency[i];
        } else {
            qty = ((data[i][2]-data[i][0])*60-data[i][1]+data[i][3])/frequency26a;
        }    
        if(data[i][0] !== 0 && data[i][1] !== 0) {
            fminute = data[i][1];
            fhour = data[i][0];
            appendString += "<tr><th>" + twoDigit(data[i][0]) + "</th><td>" + twoDigit(data[i][1]) + "</td>";
        }
        for(j=0; j<qty; j++) {
            if (route === "26") {
                fminute += frequency[i];
            } else {
                fminute += frequency26a;
            }
            if(fminute >= 60) {                
                fminute %= 60;
                fhour++;
                appendString += "</tr><tr><th>" + twoDigit(fhour) + "</th><td>" + twoDigit(fminute) + "</td>";
            } else {
                appendString += "<td>" + twoDigit(fminute) + "</td>";
            }
        }
    }
    $(timetable).append(appendString);    
}

function getNextBusTime(route, div, table) {
    today = new Date();
    hour = today.getHours();
    minute = today.getMinutes();
    if (route === "26") {
        if (div === "div.gmb26.fromcampus") {
            data = fromcampus;
        } else {
            data = tocampus;
        }
    } else {
        data = fromcampus26a;
    }
    if ((route === "26a" && getDayState() === 0) || route === "26") {
        for (i = 0; i < data.length; i++) {
            if ((hour >= data[i][0] && hour <= data[i][2])) {
                if (hour === data[data.length - 1][2] && minute > data[data.length - 1][3]) {
                    $(div).children("div.time").text("N/A");
                    break;
                }
                index = hour - data[0][0];
                if (route === "26") {
                    qty = Math.ceil(((hour - data[i][0]) * 60 + minute) / frequency[i]);
                } else {
                    qty = Math.ceil(((hour - data[i][0]) * 60 + minute) / frequency26a);
                }
                for (j = data[i][0] - data[0][0]; j < hour - data[0][0]; j++) {
                    qty -= $(table + " tr").eq(j + 1).children("td").length;
                }
                if (qty >= $(table + " tr").eq(index + 1).children("td").length) {
                    qty -= $(table + " tr").eq(index + 1).children("td").length;
                    index++;
                }
                $(table + " tr").eq(index + 1).children("td").eq(qty).addClass("next");
                finalHour = $(table + " tr").eq(index + 1).children("th").text();
                finalMin = $(table + " tr").eq(index + 1).children("td").eq(qty).text();
                if (hour === parseInt(finalHour) && minute === parseInt(finalMin)) {
                    $(div).children("div.time").css("color", "#FF3A2D");
                }
                $(div).children("div.time").text(finalHour + ":" + finalMin);
                break;
            }
        }
    }
}

$(document).ready(function(){
    loadTimetable("26", "table.gmb26.from");
    loadTimetable("26", "table.gmb26.to");
    loadTimetable("26a", "table.gmb26a.from");
    getNextBusTime("26", "div.gmb26.fromcampus", "table.gmb26.from");
    getNextBusTime("26", "div.gmb26.tocampus", "table.gmb26.to");
    getNextBusTime("26a", "div.gmb26a.fromcampus", "table.gmb26a.from");
    setInterval(function() {
        $(".timetable td").removeClass("next");
        $("div.nextbus").children("div.time").css("color", "#1F1F21");        
        getNextBusTime("26", "div.gmb26.fromcampus", "table.gmb26.from");
    getNextBusTime("26", "div.gmb26.tocampus", "table.gmb26.to");
    getNextBusTime("26a", "div.gmb26a.fromcampus", "table.gmb26a.from");
    }, 10000); 
    $("div.fromcampus").on("click", function() {
            $("table.from").slideToggle("fast");
    });
    $("div.tocampus").on("click", function() {
            $("table.to").slideToggle("fast");
    });
    $("div.mainroad").on("click", function() {
            $("table.mainroad").slideToggle("fast");
    });    
    $("div.ttb").on("click", function() {
            $("table.ttb").slideToggle("fast");
    });    
    $("div.faretb").on("click", function() {
            $("table.faretb").slideToggle("fast");
    });
    
    $("div.route26a").css("left", -$("div.route26a").outerWidth());
    
    $("#route26").on("click", function() {
        $(".navbar nav").removeClass("active");
            $(this).addClass("active");
            if(parseInt($("div.route26").css('left'),10) !== 0) {
            $("div.route26").show();
            $("div.route26a").animate({
                left: -$("div.route26a").outerWidth()
            });
            $("div.route26").animate({
                left: 0
            }, function() {
                $("div.route26a").hide();
            });
        };
    });
    
    $("#route26a").on("click", function() {
        $(".navbar nav").removeClass("active");
        $(this).addClass("active");
        if(parseInt($("div.route26").css('left'),10) === 0) {
            $("div.route26a").show();
            $("div.route26a").animate({
                left: 0
            });
            $("div.route26").animate({
                left: $("div.route26").outerWidth()
            }, function() {
                $("div.route26").hide();
            });
        };            
    });
});