var isZH=/\/zh\/{1}/.test(window.location.href);
var route="74K";
var bound="1";
function loadBusStop() {
	$.get("../../json/74k.json",function(data) {
		for(i=0;i<data['bus_arr'].length;i++) {
			isZH ? $("div.stationlist").append("<div data-stopseq='"+i+"' data-stop='"+data['bus_arr'][i]["STOP_CODE"]+"' class='station'>"+data['bus_arr'][i]["STOP_NAME_CHI"]+"</div>")
				: $("div.stationlist").append("<div data-stopseq='"+i+"' data-stop='"+data['bus_arr'][i]["STOP_CODE"]+"' class='station'>"+data['bus_arr'][i]["STOP_NAME_ENG"]+"</div>")
		}
	}, "json")
}
function timeEst(element,hour,minute)
	{
	regex=/(\d{1,2}:\d{1,2})/;
	schedule=$(element+" .schedule:first-child");
	time=schedule.text();
	ei=schedule.data("ei");
	eot=schedule.data("eot");
	display=schedule.parents(".etablock").children(".busstop").children("div");
	if(regex.test(time)) {
		time=time.split(regex);
		timenow=time[1].split(":");
		if(hour===0) {
			hour=24;
		}
		nowHour=parseInt(timenow[0]);
		if(nowHour===0) {
			nowHour=24;
		}
		remMin=(nowHour*60+parseInt(timenow[1]))-(hour*60+minute);
		if(ei==="N"&&eot==="T") {
			if(remMin<=0) {
				isZH?display.html("到達/離開"):display.html("Arrived/Departed")
			} else {
				isZH?display.html("即將到達"):display.html("Arriving")
			}
		} else {
			if(isZH) {
				display.html(remMin+" 分鐘");
			} else {
				remMin===1?display.html(remMin+" minute"):display.html(remMin+" minutes")
			}
		}
	} else {
		display.html("N/A");
	}
}
function getETA(stopid,lang,busstop,stopseq,servType,hour,minute) {;
	url = "http://etav3.kmb.hk/?action=geteta&lang=" + lang + "&route=" + route + "&bound=" + bound + "&stop=" + busstop + "&stop_seq=" + stopseq + "&serviceType=" + servType;
	$.get("https://cors-anywhere.herokuapp.com/" + url + "&rnd=" + new Date().getTime(),function(data) {
		$(stopid).html("");		
		if(typeof(data['response'])==="undefined") {
			isZH ? $(stopid).append("<div class='schedule'>暫無資料</div>") : $(stopid).append("<div class='schedule'>No Information Found</div>")
		} else {
			for(i=0; i<data['response'].length; i++) {
				appendString = "<div data-ei='" + data['response'][i]['ei'] + "' data-eot='" + data['response'][i]['eot'] + "' class='schedule'>";
				if(data['response'][i]['w']==="Y") {
					appendString += "<img src='../../icons/wheelchair_icon.jpg' alt='Wheelchair friendly'>";
				}				
				if(data['response'][i]['wifi']) {
					appendString += "<div class='wifi'><img src='../../icons/wifi.png' alt='WiFi available'></div>";					
				}
				appendString += data['response'][i]['t'] + "</div>";
				$(stopid).append(appendString);
			}
			timeEst(stopid,hour,minute)
		}
	} ,"json");
}
$(document).ready(function() {
	if(/74k_ETA/i.test(window.location.href)) {
		loadBusStop();
	}
	today=new Date();
	hour=today.getHours();
	minute=today.getMinutes();
	isZH?lang="tc":lang="en";
	getETA("#tpmmtr .time",lang,"TA10T14000","0","1",hour,minute);
	getETA("#tpcentral .time",lang,"TA07T13500","4","1",hour,minute);
	if(hour===0||hour>=12) {
		getETA("#eduhk .time",lang,"HO04T10000","22","2",hour,minute)
	} else {
		getETA("#eduhk .time",lang,"HO04T10000","11","1",hour,minute)
	}
	setInterval(function() {
		today=new Date();
		hour=today.getHours();
		minute=today.getMinutes();
		getETA("#tpmmtr .time",lang,"TA10T14000","0","1",hour,minute);
		getETA("#tpcentral .time",lang,"TA07T13500","4","1",hour,minute);
		if(hour===0||hour>=12) {
			getETA("#eduhk .time",lang,"HO04T10000","22","2",hour,minute);
		} else {
			getETA("#eduhk .time",lang,"HO04T10000","11","1",hour,minute);
		}
	}, 20000);
	$("div.stationlist").on("click","div.station",function()
		{
		$("div.stationlist div.station").removeClass("active");
		$(this).addClass("active");
		stopseq=$(this).attr("data-stopseq");
		stop=$(this).attr("data-stop");
		if(stop==="HO04T10000") {
			if(hour===0||hour>=12) {
				getETA(".status",lang,stop,"22","2");
			} else {
				getETA(".status",lang,stop,"11","1");
			}
		} else {
			getETA(".status",lang,stop,stopseq,"1");
		}
	});
});