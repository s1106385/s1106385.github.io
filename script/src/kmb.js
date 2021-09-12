var timetable = [[5,50],[6,20,40],[7,0,20,35,47,57],[8,9,26,43],[9,0,20,40],[10,0,20,40],[11,0,20,40],[12,0,20,40],[13,0,20,40],[14,0,20,40],[15,0,20,40],[16,0,20,35,50],[17,5,20,35,50],[18,10,30,50],[19,10,30,50],[20,10,30,50],[21,10,30,50],[22,10,30,50],[23,10,30,50],[0,10]];
var timetable_holiday = [[5,50],[6,10,30,50],[7,10,30,50],[8,10,30,50],[9,10,30,50],[10,10,30,50],[11,10,30,50],[12,10,30,50],[13,10,30,50],[14,10,30,50],[15,10,30,50],[16,10,30,50],[17,10,30,50],[18,10,30,50],[19,10,30,50],[20,10,30,50],[21,10,30,50],[22,10,30,50],[23,10,30,50],[0,10]];
var isZH = /\/zh\/{1}/.test(window.location.href);

function initTable(date) {
    if (isZH) {
        $(".ttb").html("<tr><th>時</th><th colspan=\"12\">分</th></tr>");
    } else {
        $(".ttb").html("<tr><th>Hour</th><th colspan=\"12\">Minute</th></tr>");
    }
    appendString = "";
    if (date === 0) {
        for (i = 0; i < timetable.length; i++) {
            appendString += "<tr><th>" + twoDigit(timetable[i][0]) + "</th>";
            for (j = 1; j < timetable[i].length; j++) {
                appendString += "<td>" + twoDigit(timetable[i][j]) + "</td>";
            }
            appendString += "</tr>";
        }        
    } else {
        for (i = 0; i < timetable_holiday.length; i++) {
            appendString += "<tr><th>" + twoDigit(timetable_holiday[i][0]) + "</th>";
            for (j = 1; j < timetable_holiday[i].length; j++) {
                appendString += "<td>" + twoDigit(timetable_holiday[i][j]) + "</td>";
            }
            appendString += "</tr>";
        }
    }
    $(".ttb").append(appendString);
    
    if (isZH) {
        switch(date) { 
            case 0 : { $("#period").text("時間表：星期一至星期五"); break; }
            case 1 : { $("#period").text("時間表：星期六"); break; }
            case 2 : { $("#period").text("時間表：星期日"); break; }
            case 3 : { $("#period").text("時間表：公眾假期 (" + getHolidayDescription(0) + ")"); break; }
            default : { $("#period").text("時間表：N/A"); break; }
        }    
    } else {
        switch(date) { 
            case 0 : { $("#period").text("Timetable: Monday to Friday"); break; }
            case 1 : { $("#period").text("Timetable: Saturday"); break; }
            case 2 : { $("#period").text("Timetable: Sunday"); break; }
            case 3 : { $("#period").text("Timetable: Public Holiday (" + getHolidayDescription(1) + ")"); break; }
            default : { $("#period").text("Timetable: N/A"); break; }
        }    
    }
}

function twoDigit(number) {
    if(number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function getRealTimeNews() {
    $("div.realtimenews").text("");
    if(isZH) {
        link = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fkmb.hk%2Fajax%2Fgetnews.php%3Flang%3Dchi%26routeno%3D74K%22";
    } else {
        link = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fkmb.hk%2Fajax%2Fgetnews.php%3Flang%3Deng%26routeno%3D74K%22";
    }
    $.get(link, function(data) {
        newslist = data.getElementsByTagName("body")[0].childNodes;
        for (i = 0; i < newslist.length; i++) {
            if (newslist[i].nodeType === 1) {
                news = newslist;
                tempString = "<a href='http://kmb.hk" + news[i].childNodes[0].getAttribute("href");
                tempString += "' target='_blank'>" + news[i].childNodes[0].childNodes[0].nodeValue + "</a>";
                $("div.realtimenews").append(tempString);
            }
        }
    });
}

$(document).ready(function(){
    $("div.realtimenews").css("left", -$("div.realtimenews").outerWidth());
    $("div.timetable").css("left", -$("div.timetable").outerWidth()*2);
    daystate = getDayState();
    today = new Date();
    hour = today.getHours();
    minute = today.getMinutes();
    initTable(daystate);
    setInterval(function() {
        today = new Date();
        hour = today.getHours();
        minute = today.getMinutes();
        $(".timetable td").removeClass("next");
        $("div.time").css("color", "#1F1F21");
        $("tr.note").removeClass("active");
        if(daystate !== getDayState()) {
            daystate = getDayState();
            initTable(daystate);
        }
        //getNextBusTime(daystate, hour, minute);
    }, 10000);
    
    $("#timetable").on("click", function() {
        if (parseInt($("div.timetable").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.realtimenews").show();
            $("div.timetable").show();
            $("div.timetable").animate({
                left: 0
            });
            $("div.realtimenews").animate({
                left: $("div.realtimenews").outerWidth()
            });
            $("div.buseta").animate({
                left: $("div.buseta").outerWidth() * 2
            }, function() {
                $("div.buseta").hide();
                $("div.realtimenews").hide();
            });
        }
    });
    
    $("#news").on("click", function() {
        getRealTimeNews();
        if (parseInt($("div.realtimenews").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.buseta").show();
            $("div.realtimenews").show();
            $("div.timetable").show();
            $("div.timetable").animate({
                left: -$("div.timetable").outerWidth()
            });
            $("div.realtimenews").animate({
                left: 0
            });
            $("div.buseta").animate({
                left: $("div.buseta").outerWidth()
            }, function() {
                $("div.timetable").hide();
                $("div.buseta").hide();
            });
        }
    });
    
    $("#eta").on("click", function() {
        if (parseInt($("div.buseta").css('left'), 10) !== 0) {
            $(".navbar td").removeClass("active");
            $(this).addClass("active");
            $("div.realtimenews").show();
            $("div.timetable").show();
            $("div.buseta").show();
            $("div.timetable").animate({
                left: -$("div.timetable").outerWidth() * 2
            });
            $("div.realtimenews").animate({
                left: -$("div.realtimenews").outerWidth()
            });
            $("div.buseta").animate({
                left: 0
            }, function() {
                $("div.timetable").hide();
                $("div.realtimenews").hide();
            });
        }
    });
});