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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.856110168807043, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8687272727272727, 500, 1500, "/api/v3/user/info-mobile"], "isController": false}, {"data": [0.9850909090909091, 500, 1500, "/api/v3/user/shiftsv2"], "isController": false}, {"data": [0.9956427015250545, 500, 1500, "/api/v3/user/notice/unseen-count"], "isController": false}, {"data": [0.9985433357611071, 500, 1500, "/api/v3/states"], "isController": false}, {"data": [0.9930808448652586, 500, 1500, "/api/v3/getsavedfilters"], "isController": false}, {"data": [0.9901818181818182, 500, 1500, "/api/v3/user/notices"], "isController": false}, {"data": [0.5079710144927536, 500, 1500, "/api/v3/shifts/availablev3"], "isController": false}, {"data": [0.7925764192139738, 500, 1500, "/api/v3/announcements"], "isController": false}, {"data": [0.9996368917937546, 500, 1500, "/api/v3/user/showonboardingflow"], "isController": false}, {"data": [0.5050614605929139, 500, 1500, "POST Login"], "isController": false}, {"data": [0.9821558630735615, 500, 1500, "/api/v3/filtersv2"], "isController": false}, {"data": [0.9992716678805535, 500, 1500, "/api/v3/recent-overdue-timesheet"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.9822076978939724, 500, 1500, "/api/v3/nurse/requirementsV2"], "isController": false}, {"data": [0.9989090909090909, 500, 1500, "/api/v3/roles"], "isController": false}, {"data": [0.8195352214960058, 500, 1500, "/api/v3/user/info"], "isController": false}, {"data": [0.9974582425562818, 500, 1500, "/api/v3/features/global"], "isController": false}, {"data": [0.996, 500, 1500, "/api/v3/nurse/checkcredentialexpire"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23389, 0, 0.0, 257.68493736371687, 2, 2877, 93.0, 784.0, 1091.9500000000007, 1594.9900000000016, 38.63951377221372, 105.12451467515567, 17.80863913586855], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/v3/user/info-mobile", 1375, 0, 0.0, 379.2734545454553, 39, 1284, 339.0, 728.2000000000003, 878.6000000000001, 1012.48, 2.2807002993937484, 8.511571897521916, 1.0757600044991997], "isController": false}, {"data": ["/api/v3/user/shiftsv2", 1375, 0, 0.0, 121.29454545454553, 10, 1009, 95.0, 283.0, 394.4000000000001, 608.24, 2.2810862283773763, 1.8503546129992052, 1.0692591695518952], "isController": false}, {"data": ["/api/v3/user/notice/unseen-count", 1377, 0, 0.0, 61.89469862018883, 3, 905, 17.0, 110.20000000000005, 200.0, 495.10000000000014, 2.282480593942227, 1.4131764614837614, 1.0944316129156575], "isController": false}, {"data": ["/api/v3/states", 1373, 0, 0.0, 48.95702840495262, 3, 592, 11.0, 101.0, 188.29999999999995, 395.26, 2.280389974920693, 6.8122196614085935, 1.0533441973998903], "isController": false}, {"data": ["/api/v3/getsavedfilters", 1373, 0, 0.0, 100.02986161689734, 6, 806, 91.0, 199.0, 290.29999999999995, 594.0, 2.2800302232702574, 1.3738072732009268, 1.073217351187758], "isController": false}, {"data": ["/api/v3/user/notices", 1375, 0, 0.0, 118.10327272727262, 11, 998, 93.0, 269.4000000000001, 344.0000000000007, 611.1200000000001, 2.2813360167375403, 2.3684269913367304, 1.0671483906418768], "isController": false}, {"data": ["/api/v3/shifts/availablev3", 1380, 0, 0.0, 1021.2514492753621, 172, 2877, 1002.0, 1705.7000000000003, 1906.95, 2381.5200000000004, 2.2832259003851703, 13.261110199980807, 1.081410704772273], "isController": false}, {"data": ["/api/v3/announcements", 1374, 0, 0.0, 474.0691411935952, 33, 1607, 410.5, 977.0, 1095.25, 1386.5, 2.2785653993044903, 3.0373454785650678, 1.0680775309239798], "isController": false}, {"data": ["/api/v3/user/showonboardingflow", 1377, 0, 0.0, 35.873638344226606, 2, 502, 6.0, 95.0, 109.0, 290.44000000000005, 2.2825070779268137, 1.4354829669774103, 1.092215300961073], "isController": false}, {"data": ["POST Login", 1383, 0, 0.0, 1008.5220535068677, 270, 2211, 1003.0, 1475.6000000000001, 1586.8, 1796.4400000000007, 2.284975993708468, 9.039569050512343, 0.6763450978756166], "isController": false}, {"data": ["/api/v3/filtersv2", 1373, 0, 0.0, 177.37873270211222, 20, 895, 154.0, 341.8000000000004, 422.29999999999995, 692.26, 2.279965858632153, 9.596069858515083, 1.05982787959854], "isController": false}, {"data": ["/api/v3/recent-overdue-timesheet", 1373, 0, 0.0, 42.95775673707217, 2, 603, 9.0, 97.0, 165.0, 378.0, 2.28068543484183, 1.4900181210050631, 1.0935708481516981], "isController": false}, {"data": ["Transaction Controller", 1373, 0, 0.0, 4377.102694828842, 1514, 7824, 4085.0, 6012.8, 6296.099999999999, 7058.76, 2.2696540802528524, 104.93709040223958, 17.785090295410438], "isController": true}, {"data": ["/api/v3/nurse/requirementsV2", 1377, 0, 0.0, 146.98547567175038, 9, 965, 104.0, 308.0, 470.49999999999955, 705.22, 2.2824162782525677, 12.544186074940164, 1.0854850854580083], "isController": false}, {"data": ["/api/v3/roles", 1375, 0, 0.0, 51.335999999999984, 3, 787, 12.0, 108.0, 200.0, 394.68000000000006, 2.281669152994629, 1.7223928274070779, 1.0517068752084615], "isController": false}, {"data": ["/api/v3/user/info", 1377, 0, 0.0, 436.140159767611, 29, 1516, 383.0, 896.2, 1022.1999999999998, 1291.3200000000002, 2.2813574822561087, 9.728652087599489, 1.060474767142488], "isController": false}, {"data": ["/api/v3/features/global", 1377, 0, 0.0, 75.00435729847506, 4, 657, 48.0, 190.0, 275.2999999999997, 406.8800000000001, 2.282495727572449, 19.909561597548098, 1.0743778717675003], "isController": false}, {"data": ["/api/v3/nurse/checkcredentialexpire", 1375, 0, 0.0, 74.39709090909088, 4, 799, 31.0, 188.0, 281.20000000000005, 498.24, 2.282430431520447, 1.3752534924298008, 1.1010943683311534], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23389, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
