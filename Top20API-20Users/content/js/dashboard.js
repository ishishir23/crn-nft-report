/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8261067116707776, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8278114792347177, 500, 1500, "/api/v3/user/info-mobile"], "isController": false}, {"data": [0.9627634660421546, 500, 1500, "/api/v3/user/shiftsv2"], "isController": false}, {"data": [0.9925407925407925, 500, 1500, "/api/v3/user/notice/unseen-count"], "isController": false}, {"data": [0.9943741209563994, 500, 1500, "/api/v3/states"], "isController": false}, {"data": [0.9734741784037558, 500, 1500, "/api/v3/getsavedfilters"], "isController": false}, {"data": [0.9698457223001402, 500, 1500, "/api/v3/user/notices"], "isController": false}, {"data": [0.40176908752327745, 500, 1500, "/api/v3/shifts/availablev3"], "isController": false}, {"data": [0.7325526932084309, 500, 1500, "/api/v3/announcements"], "isController": false}, {"data": [0.9976689976689976, 500, 1500, "/api/v3/user/showonboardingflow"], "isController": false}, {"data": [0.3825581395348837, 500, 1500, "POST Login"], "isController": false}, {"data": [0.9557169634489222, 500, 1500, "/api/v3/filtersv2"], "isController": false}, {"data": [0.9948405253283302, 500, 1500, "/api/v3/recent-overdue-timesheet"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.9554778554778555, 500, 1500, "/api/v3/nurse/requirementsV2"], "isController": false}, {"data": [0.9939167056621432, 500, 1500, "/api/v3/roles"], "isController": false}, {"data": [0.7634032634032634, 500, 1500, "/api/v3/user/info"], "isController": false}, {"data": [0.9855477855477855, 500, 1500, "/api/v3/features/global"], "isController": false}, {"data": [0.9864738805970149, 500, 1500, "/api/v3/nurse/checkcredentialexpire"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 36385, 0, 0.0, 329.2229765013077, 1, 4159, 91.0, 859.0, 1377.0, 2285.9600000000064, 60.62731820135901, 156.77334456626514, 27.944893536654657], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/v3/user/info-mobile", 2143, 0, 0.0, 452.1451236584218, 34, 2476, 311.0, 1029.800000000001, 1281.8, 1761.0, 3.6068393618435777, 13.41043062483064, 1.7012728630570784], "isController": false}, {"data": ["/api/v3/user/shiftsv2", 2135, 0, 0.0, 166.07540983606526, 7, 1124, 100.0, 455.8000000000002, 587.0, 834.5199999999977, 3.5969283747948824, 2.541460956795583, 1.686060175685101], "isController": false}, {"data": ["/api/v3/user/notice/unseen-count", 2145, 0, 0.0, 80.48717948717939, 2, 1102, 18.0, 206.4000000000001, 317.6999999999998, 583.54, 3.6105640559511185, 2.2354468862041106, 1.7312372572968742], "isController": false}, {"data": ["/api/v3/states", 2133, 0, 0.0, 65.70182841068913, 2, 998, 14.0, 190.20000000000027, 300.0, 543.3399999999929, 3.597176899142445, 10.745863412574941, 1.6615865950140396], "isController": false}, {"data": ["/api/v3/getsavedfilters", 2130, 0, 0.0, 147.43943661971852, 5, 1097, 92.0, 393.0, 508.34999999999945, 873.2100000000005, 3.594505974811457, 2.1658302602135437, 1.691945195174924], "isController": false}, {"data": ["/api/v3/user/notices", 2139, 0, 0.0, 145.25853202431054, 9, 1227, 86.0, 386.0, 546.0, 813.3999999999996, 3.602204771616176, 3.042993175451286, 1.685015708597801], "isController": false}, {"data": ["/api/v3/shifts/availablev3", 2148, 0, 0.0, 1328.7118249534467, 171, 4159, 1170.0, 2573.4000000000005, 2885.0, 3549.5699999999983, 3.5982611754654874, 17.07258575552177, 1.7042545606452746], "isController": false}, {"data": ["/api/v3/announcements", 2135, 0, 0.0, 611.7433255269311, 27, 3406, 409.0, 1481.2000000000003, 1800.1999999999998, 2402.119999999999, 3.5971404839206977, 4.79501636772632, 1.6861596018378269], "isController": false}, {"data": ["/api/v3/user/showonboardingflow", 2145, 0, 0.0, 55.48951048951055, 1, 751, 10.0, 178.0, 255.69999999999982, 393.0799999999999, 3.6105579784915105, 2.2707024786606764, 1.7277084076766016], "isController": false}, {"data": ["POST Login", 2150, 0, 0.0, 1259.5948837209316, 272, 3482, 1186.5, 2152.9, 2393.45, 2879.309999999996, 3.58248547843677, 14.122372223469611, 1.0619898733341442], "isController": false}, {"data": ["/api/v3/filtersv2", 2134, 0, 0.0, 210.7146204311149, 17, 1485, 145.0, 480.5, 640.0, 977.3000000000002, 3.5980441746754344, 13.893653973823975, 1.6725283468217838], "isController": false}, {"data": ["/api/v3/recent-overdue-timesheet", 2132, 0, 0.0, 70.15150093808634, 2, 860, 15.5, 198.0, 296.0, 508.6900000000005, 3.59547833184646, 2.348999027348908, 1.7240037704459101], "isController": false}, {"data": ["Transaction Controller", 2130, 0, 0.0, 5591.916901408452, 1650, 13448, 5495.0, 7645.600000000001, 8231.699999999999, 9316.210000000001, 3.551213331221501, 155.9413707886653, 27.82900694195517], "isController": true}, {"data": ["/api/v3/nurse/requirementsV2", 2145, 0, 0.0, 167.7631701631704, 6, 1675, 79.0, 475.8000000000002, 662.7999999999993, 998.0799999999999, 3.610187292140732, 17.818276549498275, 1.716954307883336], "isController": false}, {"data": ["/api/v3/roles", 2137, 0, 0.0, 69.36359382311652, 2, 905, 15.0, 195.0, 293.0999999999999, 536.9599999999991, 3.5995458878936004, 2.7172353235759306, 1.6591656827009562], "isController": false}, {"data": ["/api/v3/user/info", 2145, 0, 0.0, 544.3296037296031, 20, 2581, 378.0, 1291.6000000000004, 1594.0, 2194.7, 3.608705307572729, 15.346906184492326, 1.677484107817011], "isController": false}, {"data": ["/api/v3/features/global", 2145, 0, 0.0, 108.60885780885795, 3, 1093, 47.0, 316.0, 412.39999999999964, 674.8599999999997, 3.6104789733783984, 31.49369187938896, 1.6994637355160038], "isController": false}, {"data": ["/api/v3/nurse/checkcredentialexpire", 2144, 0, 0.0, 103.8045708955224, 3, 1156, 37.0, 282.0, 391.5, 733.4500000000071, 3.609609912958567, 2.1749309729447615, 1.7413547822280586], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 36385, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
