var timetable = [[5,50],[6,20,50],[7,5,20,35,47,57],[8,9,26,43],[9,0,20,40],[10,0,20,40],[11,0,20,40],[12,0,20,40],[13,0,20,40],[14,0,20,40],[15,0,20,40],[16,0,20,35,50],[17,5,20,35,50],[18,10,30,50],[19,10,30,50],[20,10,30,50],[21,10,30,50],[22,10,30,50],[23,10,30,50],[0,10]];
var timetable_holiday = [[5,50],[6,10,30,50],[7,10,30,50],[8,10,30,50],[9,10,30,50],[10,10,30,50],[11,10,30,50],[12,10,30,50],[13,10,30,50],[14,10,30,50],[15,10,30,50],[16,10,30,50],[17,10,30,50],[18,10,30,50],[19,10,30,50],[20,10,30,50],[21,10,30,50],[22,10,30,50],[23,10,30,50],[0,10]];
var jtime = [10,25,45];
var isZH = /\/zh\/{1}/.test(window.location.href);

function initTable(date) {
    if (isZH) {
        $("table.tpmarket").html("<tr><th>時</th><th colspan=\"12\">分</th></tr>");
    } else {
        $("table.tpmarket").html("<tr><th>Hour</th><th colspan=\"12\">Minute</th></tr>");
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
    $("table.tpmarket").append(appendString);
    
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

function updateEstTimeTable(stop, dh, dm, ah, am) {
    if (stop === "#hkied") {
        $("table.hkied tr").children("td.fmarket").text(twoDigit(dh) + ":" + twoDigit(dm));
        $("table.hkied tr").children("td.fied").text(twoDigit(ah) + ":" + twoDigit(am));
        dh > 12 || dh === 0 ? $("#after").addClass("active") : $("#before").addClass("active");
    } else {
        $("table.tpcenter tr").children("td.fmarket").text(twoDigit(dh) + ":" + twoDigit(dm));
        $("table.tpcenter tr").children("td.fcenter").text(twoDigit(ah) + ":" + twoDigit(am));
    }
}

function getNextBusTime(date, hour, minute) {    
    if (date === 0) {
        data = timetable;
    } else {
        data = timetable_holiday;
    }
    firstHour = data[0][0];
    if(hour !== 0) {
        index = hour - firstHour;
    } else {
        index = data.length-1;
    }
    if ((hour >= firstHour && hour <= data[data.length - 2][0]) || hour === 0) {
        if (minute > data[index][data[index].length - 1] && data.length > index + 1) {
            $("#tpmarket").children("div.time").text(twoDigit(data[index + 1][0]) + ":" + twoDigit(data[index + 1][1]));
            $("table.tpmarket tr").eq(index + 2).children("td:eq(0)").addClass("next");
        } else if (index >= 0 && index < data.length) {
            for (i = 1; i < data[index].length; i++) {
                if (minute <= data[index][i]) {
                    $("#tpmarket").children("div.time").text(twoDigit(data[index][0]) + ":" + twoDigit(data[index][i]));
                    $("table.tpmarket tr").eq(index + 1).children("td").eq(i - 1).addClass("next");
                    if (minute === data[index][i]) {
                        $("#tpmarket").children("div.time").css("color", "#FF3A2D");
                    }
                    break;
                }
            }
        } else {
            $("#tpmarket").children("div.time").text("N/A");
        }
    }    
}

function estimateBusTime(date, hour, minute, stop) {
    if (date === 0) {
        data = timetable;
    } else {
        data = timetable_holiday;
    }
    firstHour = data[0][0];
    if(hour !== 0) {
        index = hour - firstHour;
    } else {
        index = data.length-1;
    }
    if(stop === "#tpcenter") {
        wtime = jtime[0];
    } else if(stop === "#hkied" && (hour >= 12 || hour === 0)) {
        if(hour === 12 && (data[index-1][data[index-1].length-1]+jtime[1])%60 >= minute) {
            wtime = jtime[1];
        } else {
            wtime = jtime[2];
        }
    } else {
        wtime = jtime[1];
    }
    if ((hour >= firstHour && hour <= data[data.length - 2][0]) || hour === 0) {        
        if(index > 0 && (data[index-1][data[index-1].length-1]+wtime)%60 >= minute) {
            for(i=1; i<data[index-1].length; i++) {
                if(data[index-1][i] >= 60-wtime+minute) {
                    finalMin = (data[index-1][i]+wtime)%60;                    
                    prevHr = hour-1;
                    if(hour-1 < 0) {
                        prevHr = 23;
                    }
                    if(minute === finalMin) {
                        $(stop).children("div.time").css("color", "#FF3A2D");
                    }
                    $(stop).children("div.time").text(twoDigit(hour) + ":" + twoDigit(finalMin));
                    updateEstTimeTable(stop, prevHr, data[index-1][i], hour, finalMin);
                    break;
                }
            }
        } else if(index <= data.length-1) {
            for(i=1; i<data[index].length; i++) {
                if(data[index][i] >= minute-wtime) {                    
                    finalMin = data[index][i]+wtime;
                    finalHour = hour;
                    if(finalMin >= 60) {
                        finalMin %= 60;
                        finalHour++;
                    }
                    finalHour %= 24;
                    if(hour === finalHour && minute === finalMin) {
                        $(stop).children("div.time").css("color", "#FF3A2D");
                    }
                    $(stop).children("div.time").text(twoDigit(finalHour) + ":" + twoDigit(finalMin));
                    updateEstTimeTable(stop, hour, data[index][i], finalHour, finalMin);
                    break;
                }
            }
        } else {
            $(stop).children("div.time").text("N/A");
            $("table.timetable tr").children("td.fmarket").text("N/A");
            $("table.hkied tr").children("td.fied").text("N/A");
            $("table.tpcenter tr").children("td.fcenter").text("N/A");
        }
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
    daystate = getDayState();
    today = new Date();
    hour = today.getHours();
    minute = today.getMinutes();
    initTable(daystate);
    getNextBusTime(daystate, hour, minute);
    estimateBusTime(daystate, hour, minute, "#tpcenter");
    estimateBusTime(daystate, hour, minute, "#hkied");
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
        getNextBusTime(daystate, hour, minute);
        estimateBusTime(daystate, hour, minute, "#tpcenter");
        estimateBusTime(daystate, hour, minute, "#hkied");
    }, 10000);   
    
    $("#tpmarket").on("click", function() {
            $("table.tpmarket").slideToggle("fast");
    });
    
    $("#tpcenter").on("click", function() {
            $("table.tpcenter").slideToggle("fast");
    });
    
    $("#hkied").on("click", function() {
            $("table.hkied").slideToggle("fast");
    });
    
    $("div.realtimenews").css("left", -$("div.realtimenews").outerWidth());
    
    $("#news").on("click", function() {
        getRealTimeNews();
        $(".navbar nav").removeClass("active");
        $(this).addClass("active");
        if(parseInt($("div.timetable").css('left'),10) === 0) {
            $("div.realtimenews").show();
            $("div.realtimenews").animate({
                left: 0
            });
            $("div.timetable").animate({
                left: $("div.timetable").outerWidth()
            }, function() {
                $("div.timetable").hide();
            });
        };
    });
    
    $("#timetable").on("click", function() {
            $(".navbar nav").removeClass("active");
            $(this).addClass("active");
            if(parseInt($("div.timetable").css('left'),10) !== 0) {
            $("div.timetable").show();
            $("div.realtimenews").animate({
                left: -$("div.realtimenews").outerWidth()
            });
            $("div.timetable").animate({
                left: 0
            }, function() {
                $("div.realtimenews").hide();
            });
        };
    });
});