var checkZH = /\/zh\/{1}/;
var holiday = false;
var holiday = [[1,1],[2,12],[2,13],[2,15],[4,2],[4,3],[4,5],[4,6],[5,1],[5,19],[6,14],[7,1],[9,22],[10,1],[10,14],[12,25],[12,27]];
var holidaydescription = [["一月一日","農曆年初一","農曆年初二","農曆年初四","耶穌受難節","耶穌受難節翌日","清明節翌日","復活節星期一翌日","勞動節","佛誕","端午節","香港特別行政區成立紀念日","中秋節翌日","國慶日","重陽節","聖誕節","聖誕節後第一個周日"],
                          ["The first day of January","Lunar New Year's Day","The second day of Lunar New Year","The fourth day of Lunar New Year","Good Friday","The day following Good Friday","The day following Ching Ming Festival","The day following Easter Monday","Labour Day","Birthday of the Buddha","Tuen Ng Festival","Hong Kong Special Administrative Region Establishment Day","The day following the Chinese Mid-Autumn Festival","National Day","Chung Yeung Festival","Christmas Day","The first weekday after Christmas Day"]];

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