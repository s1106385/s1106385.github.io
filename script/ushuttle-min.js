var month_en = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var timeslot = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
var isZH = /\/zh\/{1}/.test(window.location.href);
var dateFormat = /[\/-]/;
var specialSchedule = {};
var jsondata = {};
var tdata_to = {};
var tdata_from = {};
var isSatAvailable = 0;
var isSunAvailable = 0;
var fareStaff = "";
var fareStudent = "";
var startEffectDate = "";
var endEffectDate = "";

function twoDigit(number) {
    if(number < 10) {
        return "0" + number;
    } else {
        return number;
    }
}

function setPeriod(state) {
    $(".eta").removeClass("notrip");
    if (isZH) {
        switch (state) {
            case 0 : { $(".period").text("時間表：星期一至星期五"); break; }
            case 1 : {
                if (isSatAvailable === 1) {
                    $(".period").text("時間表：星期六");
                } else {
                    $(".period").text("時間表：N/A (星期六)");
                }
                break;
            }
            case 2 : {
                if (isSunAvailable === 1) {
                    $(".period").text("時間表：星期日");
                } else {
                    $(".period").text("時間表：N/A (星期日)");
                }
                break;
            }
            case 3 : { $(".period").text("時間表：N/A (公眾假期 - " + getHolidayDescription(0) + ")"); break; }
            default : { $(".period").text("時間表：N/A"); break; }
        }
        if ((state === 1 && isSatAvailable === 0) || (state === 2 && isSunAvailable === 0) || state === 3) {
            $(".eta").addClass("notrip").html(jsondata.info.exceptmsg[isSatAvailable].zh);
        }
    } else {
        switch (state) {
            case 0 : { $(".period").text("Timetable: Monday to Friday"); break; }
            case 1 : {
                if (isSatAvailable === 1) {
                    $(".period").text("Timetable: Saturday");
                } else {
                    $(".period").text("Timetable: N/A (Saturday)");
                }
                break;
            }
            case 2 : {
                if (isSunAvailable === 1) {
                    $(".period").text("Timetable: Sunday");
                } else {
                    $(".period").text("Timetable: N/A (Sunday)");
                }
                break;
            }
            case 3 : { $(".period").text("Timetable: N/A (Public Holiday - " + getHolidayDescription(1) + ")"); break; }
            default : { $(".period").text("Timetable: N/A"); break; }
        }
        if ((state === 1 && isSatAvailable === 0) || (state === 2 && isSunAvailable === 0) || state === 3) {
            $(".eta").addClass("notrip").html(jsondata.info.exceptmsg[isSatAvailable].en);
        }
    }
}

function loadTimetable(data, timetable) {
    appendString = "";    
    if (/.sat/.test(timetable) && isSatAvailable === 1) {
        isZH ? $(timetable).html("<tr><th colspan=\"13\">星期六</th></tr>") : $(timetable).html("<tr><th colspan=\"13\">Saturdays</th></tr>");
        if (isZH) {
            appendString += "<tr><th>時</th><th colspan=\"12\">分</th></tr>";
        } else {
            appendString += "<tr><th>Hour</th><th colspan=\"12\">Minute</th></tr>";
        }
    } else if(/.sun/.test(timetable) && isSunAvailable === 1) {
        isZH ? $(timetable).html("<tr><th colspan=\"13\">星期日</th></tr>") : $(timetable).html("<tr><th colspan=\"13\">Sundays</th></tr>");
        if (isZH) {
            appendString += "<tr><th>時</th><th colspan=\"12\">分</th></tr>";
        } else {
             appendString += "<tr><th>Hour</th><th colspan=\"12\">Minute</th></tr>";
        }
    } else {
        isZH ? $(timetable).html("<tr><th colspan=\"13\">星期一至五</th></tr>") : $(timetable).html("<tr><th colspan=\"13\">Mondays to Fridays</th></tr>");
        if (isZH) {
            appendString += "<tr><th>時</th><th colspan=\"12\">分</th></tr>";
        } else {
            appendString += "<tr><th>Hour</th><th colspan=\"12\">Minute</th></tr>";
        }
    }
    if (data !== undefined) {
        for (i = 0; i < data.objlength; i++) {
            appendString += "<tr><th>" + twoDigit(parseInt(data.timetable[i].hour)) + "</th>";
            k = 0;
            for (j = 0; j < timeslot.length; j++) {
                if (k < data.timetable[i].minute.length && data.timetable[i].minute[k].t == timeslot[j]) {
                    appendString += "<td class='exist";
                    if(data.timetable[i].minute[k].blkd) {
                        appendString += " blk";
                    }
                    if(data.timetable[i].minute[k].st !== "NA") {
                        appendString += " special";
                    }
                    appendString += "'";                
                    if(data.timetable[i].minute[k].st !== "NA") {
                        appendString += " data-specialtrip=" + data.timetable[i].minute[k].st;                                      
                    }
                    appendString += ">" + timeslot[j] + "</td>";
                    k++;
                } else {
                    appendString += "<td>" + timeslot[j] + "</td>";
                }
            }
            appendString += "</tr>";
        }
        $(timetable).append(appendString);
        var keyindex = 0, key;
        for(key in specialSchedule) {
            if (specialSchedule.hasOwnProperty(key)) {
                $(".timetable td[data-specialtrip='" + keyindex + "']").css("background-color",specialSchedule[keyindex].color);
                keyindex++;
            }        
        }
    }
}

function fetchTimetable(direction, json) {
    var tdata = {objlength: 0, timetable:[]};
    var hrindex = 0;
    for(i=0; i < json.length; i++) {
        mins = json[i].minute;
        for(j = json[i].hour.from; j <= json[i].hour.to; j++) { //stop
            tdata.timetable[hrindex] = {hour:j, minute:[]};
            for(k = 0; k < mins.length; k++) {
                tdata.timetable[hrindex].minute[k] = {t:mins[k].t, st:mins[k].st, blkd:mins[k].blkd};
            }
            hrindex++;
        }
    }
    tdata.objlength = hrindex;
    return tdata;
}

function loadETAList (time, specialtrip, blk, islastbus) {
    appendString = "<div>";
    if(specialtrip !== "NA") {
        appendString += "<div class='special' data-specialtrip='" + specialtrip + "'>•</div>" + time;
        isZH ? appendString += " 額外班次" : appendString += " Additional Trip";
    } else {
        appendString += time;
    }
    if(islastbus) {
        isZH ? appendString += " 尾班車" : appendString += " Last shuttle";
    }
    if(blk) {
        appendString += "<div class='blk'>D</div>";
    }
    appendString += "</div>";
    return appendString;
}

function getNextBusTime(data, timetable) {
    if (data !== undefined) {
        date = new Date();
        hh = date.getHours();
        mm = date.getMinutes();
        firstHour = parseInt(data.timetable[0].hour);
        index = hh - firstHour;
        /to/.test(timetable) ? $("div.eta.to").html("") : $("div.eta.from").html("");
        if (hh >= firstHour && hh <= data.timetable[data.objlength - 1].hour) {
            minindex = 0;
            for (i = 0; i < 3; i++) {                
                time = "";
                lastbus = false;
                if (index >= data.objlength) {                    
                    if (/to/.test(timetable)) {
                        $("table.eta.to tr:last-child td:last-child").text("N/A");
                        isZH ? $("div.eta.to").append("<div>尾班車經已開出</div>") : $("div.eta.to").append("<div>Last shuttle has been departed</div>");
                    } else {
                        $("table.eta.from tr:last-child td:last-child").text("N/A");
                        isZH ? $("div.eta.from").append("<div>尾班車經已開出</div>") : $("div.eta.from").append("<div>Last shuttle has been departed</div>");
                    }
                    break;
                } else if (hh === data.timetable[index].hour && mm > parseInt(data.timetable[index].minute[data.timetable[index].minute.length-1].t)) {
                    if (index + 1 < data.objlength) {
                        index++;
                        hh = data.timetable[index].hour;
                        mm = parseInt(data.timetable[index].minute[0].t) + 1;
                        if(data.timetable[index].minute[0].st !== "NA" && !specialSchedule[data.timetable[index].minute[0].st].isToday) {
                            i--;
                        } else {                            
                            time = twoDigit(parseInt(data.timetable[index].hour)) + ":" + data.timetable[index].minute[0].t;
                            if(i === 0) { $(timetable).children("div.time").text(time); }
                            if(hh == data.timetable[index].hour && 1 >= data.timetable[index].minute.length) { lastbus = true; }
                            if (/to/.test(timetable)) {
                                $("div.eta.to").append(loadETAList(time, data.timetable[index].minute[0].st, data.timetable[index].minute[0].blkd, lastbus));
                            } else {
                                $("div.eta.from").append(loadETAList(time, data.timetable[index].minute[0].st, data.timetable[index].minute[0].blkd, lastbus));
                            }
                            minindex = 1;
                        }                        
                    } else {                        
                        if(/to/.test(timetable)) {
                            $("table.eta.to tr:last-child td:last-child").text("N/A");
                            isZH ? $("div.eta.to").append("<div>尾班車已經開出</div>") : $("div.eta.to").append("<div>Last shuttle has been departed</div>");
                        } else {
                            $("table.eta.from tr:last-child td:last-child").text("N/A");
                            isZH ? $("div.eta.from").append("<div>尾班車已經開出</div>") : $("div.eta.from").append("<div>Last shuttle has been departed</div>");
                        }
                        break;
                    }
                } else if (hh === data.timetable[index].hour && mm <= parseInt(data.timetable[index].minute[data.timetable[index].minute.length-1].t)) {
                    for(k = minindex; k < data.timetable[index].minute.length; k++) {
                        if(mm <= parseInt(data.timetable[index].minute[k].t)) {                            
                            mm = parseInt(data.timetable[index].minute[k].t) + 1;
                            if(data.timetable[index].minute[k].st !== "NA" && !specialSchedule[data.timetable[index].minute[k].st].isToday) {
                                i--;
                            } else {
                                time = twoDigit(parseInt(data.timetable[index].hour)) + ":" + data.timetable[index].minute[k].t;
                                if(i === 0) { $(timetable).children("div.time").text(time); }
                                if(index == data.objlength - 1 && k + 1 >= data.timetable[index].minute.length) { lastbus = true; }
                                if (/to/.test(timetable)) {
                                    $("div.eta.to").append(loadETAList(time, data.timetable[index].minute[k].st, data.timetable[index].minute[k].blkd, lastbus));
                                } else {
                                    $("div.eta.from").append(loadETAList(time, data.timetable[index].minute[k].st, data.timetable[index].minute[k].blkd, lastbus));
                                }
                            }
                            k = 999;
                        }
                        minindex++;                        
                    }
                } else {
                    alert (hh + " " + data.timetable[index].hour + " " + mm + " " + data.timetable[index].minute[minindex].t);
                }
            }
        } else {
            if(/to/.test(timetable)) {
                $("table.eta.to tr:last-child td:last-child").text("N/A");
                isZH ? $("div.eta.to").append("<div>本小時沒有班次，詳情請查閱時間表</div>") : $("div.eta.to").append("<div>No shuttle in this hour, please refer Timetable for details</div>");
            } else {
                $("table.eta.from tr:last-child td:last-child").text("N/A");
                isZH ? $("div.eta.from").append("<div>本小時沒有班次，詳情請查閱時間表</div>") : $("div.eta.from").append("<div>No shuttle in this hour, please refer Timetable for details</div>");
            }
        }                
    }
}

$(document).ready(function(){
    date = new Date();
    sdate = [];
    year = date.getFullYear();
    month = date.getMonth()+1;
    day = date.getDate();    
    checkday = new RegExp(date.getDay());
    url = "https://s1106385.github.io/json/cycle.json?rd=" + date.getTime();
    daystate = getDayState();

    $.get(url, function(xhr) {
        if(xhr.cycle !== undefined && xhr.cycle !== null) {
            jsondata = xhr.cycle;
            isSatAvailable = jsondata.info.issatavailable;
            isSunAvailable = jsondata.info.issunavailable;
            fareStaff = jsondata.info.fare.staff;
            fareStudent = jsondata.info.fare.student;
            startEffectDate = [jsondata.info.effdate.start.year, jsondata.info.effdate.start.month, jsondata.info.effdate.start.date];
            endEffectDate = [jsondata.info.effdate.end.year, jsondata.info.effdate.end.month, jsondata.info.effdate.end.date];

            tdata_to[0] = fetchTimetable("tocampus", jsondata.timetable.weekday.tocampus);                       
            tdata_from[0] = fetchTimetable("fromcampus", jsondata.timetable.weekday.fromcampus);
            loadTimetable(tdata_to[0], ".timetable.normal.to");            
            loadTimetable(tdata_from[0], ".timetable.normal.from");
            if(isSatAvailable === 1) {
                tdata_to[1] = fetchTimetable("tocampus", jsondata.timetable.saturday.tocampus); 
                tdata_from[1] = fetchTimetable("fromcampus", jsondata.timetable.saturday.fromcampus);
                loadTimetable(tdata_to[1], ".timetable.sat.to");
                loadTimetable(tdata_from[1], ".timetable.sat.from");
            }
            if(isSunAvailable === 1) {
                tdata_to[2] = fetchTimetable("tocampus", jsondata.timetable.sunday.tocampus); 
                loadTimetable(tdata_to[2], ".timetable.sun.to")
                loadTimetable(tdata_from[2], ".timetable.sun.from");
            }
                        
            nthchild = 1;
            for(i = 0; i < jsondata.specialtrip.length; i++) {
                specialinfo = jsondata.specialtrip[i];
                specialSchedule[i] = {isTody:false, color:specialinfo.color, day:specialinfo.day};
                for(k = 0; k < specialinfo.period.length; k++) {
                    sdate = specialinfo.period[k].date.split(dateFormat);
                    if (month > sdate[1] || (parseInt(sdate[1]) === month && day >= sdate[0]) && (month < sdate[3] || (parseInt(sdate[3]) === month && day <= sdate[2]))) {
                        specialSchedule[i].isToday = true;
                    }
                }          
                if(!checkday.test(specialSchedule[i].day)){ 
                    specialSchedule[i].isToday = false;
                }
                $("ol.notes li:nth-child(" + nthchild++ +")").after("<li class='special' data-specialtrip='" + i + "'></li>");
                $("head").append("<style>li[data-specialtrip='" + i + "']:before{color: " + specialSchedule[i].color + ";}</style>");
                $("head").append("<style>.timetable td[data-specialtrip='" + i + "']{background-color:" + specialSchedule[i].color + ";}</style>");
                $("head").append("<style>.eta div div[data-specialtrip='" + i + "']{color:" + specialSchedule[i].color + ";}</style>");
                isZH ? $("li[data-specialtrip='" + i + "']").html(specialinfo.description.zh) : $("li[data-specialtrip='" + i + "']").html(specialinfo.description.en);
                $("li[data-specialtrip='" + i + "']").show();                
            }
            setPeriod(daystate);
            if(daystate !== 3) {
                getNextBusTime(tdata_to[daystate], ".nextbus.tocampus");
                getNextBusTime(tdata_from[daystate], ".nextbus.fromcampus");
            }
            setInterval(function () {
                $(".nextbus.tocampus").children("div.time").css("color", "#1F1F21");
                $(".nextbus.fromcampus").children("div.time").css("color", "#1F1F21");
                if (daystate !== getDayState()) {
                    daystate = getDayState();                    
                    setPeriod(daystate);
                    for(i = 0; i < jsondata.specialtrip.length; i++) {
                        for(k = 0; k < jsondata.specialtrip[i].period.length; k++) {
                            sdate = jsondata.specialtrip[i].period[k].date.split(dateFormat);
                            if (month > sdate[1] || (parseInt(sdate[1]) === month && day >= sdate[0]) && (month < sdate[3] || (parseInt(sdate[3]) === month && day <= sdate[2]))) {
                                specialSchedule[i].isToday = true;
                            }
                        }
                    }   
                }
                if(daystate !== 3) {
                    getNextBusTime(tdata_to[daystate], ".nextbus.tocampus");
                    getNextBusTime(tdata_from[daystate], ".nextbus.fromcampus");
                }
            }, 10000);
            if(isZH) {
                $(".effDate").text("資料有效期：" + startEffectDate[0] + "年" + startEffectDate[1] + "月" + startEffectDate[2] + "日 至 " + endEffectDate[0] + "年" + endEffectDate[1] + "月" + endEffectDate[2] + "日");
                $(".fare").text("車資：教職員 $" + fareStaff + "；學生 $" + fareStudent);
            } else {
                $(".effDate").text("Effective from " + startEffectDate[2] + " " + month_en[parseInt(startEffectDate[1])-1] + " " + startEffectDate[0] + " to " + endEffectDate[2] + " " + month_en[parseInt(endEffectDate[1])-1] + " " + endEffectDate[0]);
                $(".fare").text("Fare: Staff $" + fareStaff + "; Students $" + fareStudent);
            }
        } else {
            return false;
        }
    }, "json");
    
    $(".timetable.tocampus").on("click", function() {
            $(".timetable.to").slideToggle("fast");
    });
    
    $(".timetable.fromcampus").on("click", function() {
            $(".timetable.from").slideToggle("fast");
    });
    
    $(".nextbus.tocampus").on("click", function() {
            $("div.eta.to").slideToggle("fast");
    });
    
    $(".nextbus.fromcampus").on("click", function() {
            $("div.eta.from").slideToggle("fast");
    });
    
    $("div.timetable").css("left", -$("div.timetable").outerWidth());
    
    $("#shuttlettb").on("click", function() {
        $(".navbar nav").removeClass("active");
        $(this).addClass("active");
        if(parseInt($("div.etashuttle").css('left'),10) === 0) {
            $("div.timetable").show();
            $("div.timetable").animate({
                left: 0
            });
            $("div.etashuttle").animate({
                left: $("div.etashuttle").outerWidth()
            }, function() {
                $("div.etashuttle").hide();
            });
        }
    });
    
    $("#shuttleeta").on("click", function() {
        $(".navbar nav").removeClass("active");
        $(this).addClass("active");
        if(parseInt($("div.etashuttle").css('left'),10) !== 0) {
             $("div.etashuttle").show();
            $("div.timetable").animate({
                left: -$("div.timetable").outerWidth()
            });
            $("div.etashuttle").animate({
                left: 0
            }, function() {
                $("div.timetable").hide();
            });
        }
    });
});