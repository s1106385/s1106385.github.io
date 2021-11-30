var checkZH = /\/zh\/{1}/;
var holiday = false;
var holiday = [[1,1],[2,1],[2,2],[2,3],[4,5],[4,15],[4,16],[4,18],[5,2],[5,9],[6,3],[7,1],[9,12],[10,1],[10,4],[12,26],[12,27]];
var holidaydescription = [["一月一日","農曆年初一","農曆年初二","農曆年初三","清明節","耶穌受難節","耶穌受難節翌日","復活節星期一","勞動節翌日","佛誕翌日","端午節","香港特別行政區成立紀念日","中秋節後第二日","國慶日","重陽節","聖誕節後第一個周日","聖誕節後第二個周日"],
                          ["The first day of January","Lunar New Year's Day","The second day of Lunar New Year","The third day of Lunar New Year","Ching Ming Festival","Good Friday","The day following Good Friday","Easter Monday","The day following Labour Day","The day following the Birthday of the Buddha","Tuen Ng Festival","Hong Kong Special Administrative Region Establishment Day","The second day following the Chinese Mid-Autumn Festival","National Day","Chung Yeung Festival","The first weekday after Christmas Day","The second weekday after Christmas Day"]];

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