var toscenter = [[12,30],[14,0],[15,15],[16,30],[17,45],[18,45],[19,30]];
var fromscenter = [[14,45],[15,45],[17,0],[18,15],[20,0],[21,15],[22,0]];
var isZH = /\/zh\/{1}/.test(window.location.href);

function twoDigit(number) {
    if(number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function loadTimetable(state, timetable) {    
    if (state === 0 || state === 1) {
        if(isZH === 0) {
            $(timetable).html("<tr><th>Hour</th><th>Minute</th></tr>");
        } else {
            $(timetable).html("<tr><th>時</th><th>分</th></tr>");
        }
        appendString = "";
        if(timetable === "#to") {
            data = toscenter;
        } else {
            data = fromscenter;
        }
        for (i = 0; i < data.length; i++) {            
            if(timetable === "#to" && (data[i][0] === 12 || data[i][0] === 16)) {
                appendString += "<tr><th>^" + twoDigit(data[i][0]) + "</th>";
            } else {
                appendString += "<tr><th>" + twoDigit(data[i][0]) + "</th>";
            }
            appendString += "<td>" + twoDigit(data[i][1]) + "</td>";
            appendString += "</tr>";
        }
        $(timetable).append(appendString);
        if(isZH) {
            if(timetable === "#to") {
                $(timetable).prepend("<tr><td colspan=\"2\">經大埔墟廣福邨近26號公共專線小巴站@</td></tr>");
            } else {
                $(timetable).prepend("<tr><td colspan=\"2\">經港鐵大埔墟站#</td></tr>");
            }
            $("#period").text("時間表：星期一至星期六，公眾假期除外");            
        } else {
            if(timetable === "#to") {
                $(timetable).prepend("<tr><td colspan=\"2\">via Tai Po Kwong Fuk Estate near Green Minibus No. 26 Stop@</td></tr>");
            } else {
                $(timetable).prepend("<tr><td colspan=\"2\">via Tai Po Market MTR Station#</td></tr>");
            }
            $("#period").text("Timetable: Monday to Saturday, except public holidays");
        }
    } else {
        if(isZH) {
            switch(state) { 
                case 2 : { $("#period").text("時間表：N/A (星期日)"); break; }
                case 3 : { $("#period").text("時間表：N/A (公眾假期 - " + getHolidayDescription(0) + ")"); break; }
                default : { $("#period").text("時間表：N/A"); break; }
            } 
            $(timetable).append("星期日及公眾假期停止服務，請乘搭其他交通公具往返目的地。");
        } else {
            switch(state) { 
                case 2 : { $("#period").text("Timetable: N/A (Sunday)"); break; }
                case 3 : { $("#period").text("Timetable: N/A (Public Holiday - " + getHolidayDescription(1) + ")"); break; }
                default : { $("#period").text("Timetable: N/A"); break; }
            }
            $(timetable).append("Service is not available on Sundays &amp; Public Holidays. Please travel by other transportations between destinations.");
        }
    }
}

function getNextBusTime(state, timetable) {
    if (state === 0 || state === 1) {
        date = new Date();
        hour = date.getHours();
        minute = date.getMinutes();
        if(timetable === "#toscenter") {
            data = toscenter;
        } else {
            data = fromscenter;
        }
        for (i = 0; i < data.length; i++) {
            if (hour < data[i][0] || (hour === data[i][0] && minute <= data[i][1])) {
                $(timetable).children("div.time").text(twoDigit(data[i][0]) + ":" + twoDigit(data[i][1]));
                if (timetable === "#toscenter") {
                    $("#to tr").eq(i + 2).children("td").addClass("next");
                } else if (timetable === "#fromscenter") {
                    $("#from tr").eq(i + 2).children("td").addClass("next");
                }
                break;
            } else if (data.length > i + 1 && hour === data[i][0] && minute > data[i][1]) {
                $(timetable).children("div.time").text(twoDigit(data[i + 1][0]) + ":" + twoDigit(data[i + 1][1]));
                if (timetable === "#toscenter") {
                    $("#to tr").eq(i + 3).children("td").addClass("next");
                } else if (timetable === "#fromscenter") {
                    $("#from tr").eq(i + 3).children("td").addClass("next");
                }
                break;
            } else {
                $(timetable).children("div.time").text("N/A");
            }
        }
    }
}

$(document).ready(function(){    
    daystate = getDayState();
    loadTimetable(daystate, "#to");
    loadTimetable(daystate, "#from");    
    getNextBusTime(daystate, "#toscenter");
    getNextBusTime(daystate, "#fromscenter");    
    setInterval(function () {
        $("td").removeClass("next");
        $("#toscenter").children("div.time").css("color", "#1F1F21");
        $("#fromscenter").children("div.time").css("color", "#1F1F21");
        if(daystate !== getDayState()) {
            daystate = getDayState();
            loadTimetable(daystate, "#to");
            loadTimetable(daystate, "#from"); 
        }
        getNextBusTime(daystate, "#toscenter");
        getNextBusTime(daystate, "#fromscenter");
    }, 10000);
    $("#toscenter").on("click", function() {
            $("#to").slideToggle("fast");
    });
    
    $("#fromscenter").on("click", function() {
            $("#from").slideToggle("fast");
    });
});