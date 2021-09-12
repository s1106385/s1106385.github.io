var checkZH = /\/zh\/{1}/;
var holiday = false;
var holiday = [[1,1],[1,25],[1,27],[1,28],[4,4],[4,10],[4,11],[4,13],[4,30],[5,1],[6,25],[7,1],[10,1],[10,2],[10,26],[12,25],[12,26]];
var holidaydescription = [["一月一日","農曆年初一","農曆年初三","農曆年初四","清明節","耶穌受難節","耶穌受難節翌日","復活節星期一","佛誕","勞動節","端午節","香港特別行政區成立紀念日","國慶日","中秋節翌日","重陽節翌日","聖誕節","聖誕節後第一個周日"],
                            ["The first day of January","Lunar New Year's Day","The third day of Lunar New Year","The fourth day of Lunar New Year","Ching Ming Festival","Good Friday","The day following Good Friday","Easter Monday","Birthday of the Buddha","Labour Day","Tuen Ng Festival","Hong Kong Special Administrative Region Establishment Day","National Day","The day following the Chinese Mid-Autumn Festival","The day following Chung Yeung Festival","Christmas Day","The first weekday after Christmas Day"]];

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