var checkZH = /\/zh\/{1}/;
var holiday = false;
var holiday = [[1,2],[1,23],[1,24],[1,25],[4,5],[4,7],[4,8],[4,10],[5,1],[5,26],[6,22],[7,1],[9,30],[10,2],[10,23],[12,25],[12,26]];
var holidaydescription = [["一月一日翌日","農曆年初二","農曆年初三","農曆年初四","清明節","耶穌受難節","耶穌受難節翌日","復活節星期一","勞動節","佛誕","端午節","香港特別行政區成立紀念日","中秋節翌日","國慶日翌日","重陽節","聖誕節","聖誕節後第一個周日"],
                          ["The day following the first day of January","The second day of Lunar New Year","The third day of Lunar New Year","The fourth day of Lunar New Year","Ching Ming Festival","Good Friday","The day following Good Friday","Easter Monday","Labour Day","The Birthday of the Buddha","Tuen Ng Festival","Hong Kong Special Administrative Region Establishment Day","The day following the Chinese Mid-Autumn Festival","The day following National Day","Chung Yeung Festival","Christmas Day","The first weekday after Christmas Day"]];

function getHolidayDescription(isEN) {
    month = today.getMonth() + 1;
    date = today.getDate();
    for (i = 0; i < holiday.length; i++) {
            if (month === holiday[i][0] && date === holiday[i][1]) {
                return holidaydescription[isEN][i];
            }
        }
}

function getDayState() { //0: mon-fri, 1:sat, 2:sun, 3:pub. holidays
    today = new Date();
    weekday = today.getDay();
    month = today.getMonth() + 1;
    date = today.getDate();
    for (i = 0; i < holiday.length; i++) {
        if (month === holiday[i][0] && date === holiday[i][1]) {                
            return 3;
        }
    }
    switch (weekday) {
        case 0 : return 2;
        case 6 : return 1;
        default : return 0;
    }
}