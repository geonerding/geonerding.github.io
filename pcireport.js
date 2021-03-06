// Get url as variable
var webby = window.location.href;
var street = "str";
var obj = "obj";
var length = "length";
var width = "width";
var condition = "condition";

function getVal( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

function getFullLength() {
	var streetName = getVal(street, webby);
	var streetLen = getVal(length, webby);
	var streetWidth = getVal(width, webby);
    var cond = getVal(condition, webby);
    if (cond == 0) {
        cond = 1;
    }
	streetName = streetName.replace('%20', ' ');
	var request = new XMLHttpRequest();

	request.open('GET', 'https://services6.arcgis.com/zYQ9VrABTTAgjneA/ArcGIS/rest/services/Roads/FeatureServer/0/query?where=FULLNAME+%3D+%27' + streetName + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pjson&token=Wmm_l_7wSt5FOlGwyyMn0CzmebEjvQWsHvEPkxcvmygKIotm59zhPts5Uzo2gj8Wm9CGpbgaqBlq8ELPpn6Fj48nQLHtsIr5KeiQ8Gh8iNrczykxWDFUr-F7xf1Z6_Rwpdu_hpvGdRBvA8lrgDDP40QTbj3MrMVMw8OYdBpyW9C7zbY5dDu_px638qwjGg-44rqz5mUzRyPfth5Xpw6pZKiRs5qwBUJY8howewq7rLop_EtDSUdXKwqOBfg6aDC8')
	request.onreadystatechange = function() {
        if ((request.readyState === 4) && (request.status === 200)) {
            var items = JSON.parse(request.responseText);
            console.log(items);
            var lengthData = [];

            for (var i = 0; i < items['features'].length; i++) {
                lengthData.push(items['features'][i]['attributes']['Length']);
            }
            var sum = 0;
            for(var ii in lengthData) {
            	sum += lengthData[ii];
        	}

            var widthData = [];
            for (var aa = 0; aa < items['features'].length; aa++) {
                widthData.push(items['features'][aa]['attributes']['Pave_Width']);
            }

            var sum2 = 0;
            for(var iii in widthData) {
            	sum2 += widthData[iii];
        	}
        	var widthAve = sum2 / widthData.length;

            //Add data to street div
            document.getElementById('street').innerHTML = 'Length of segment: ' + parseFloat(streetLen).toFixed(2) + " ft<br>" + 'Length of entire street in area: ' + parseFloat(sum).toFixed(2) + " ft<br>" + 'Width of segment: ' + parseFloat(streetWidth).toFixed(2) + " ft<br>" + "Average width of entire street in area: " + parseFloat(widthAve).toFixed(2) + " ft<br>";

            var condData = [];
            for (var bb = 0; bb < items['features'].length; bb++) {
                condData.push(items['features'][bb]['attributes']['Condition']);
            }
            var sum3 = 0;
            for(var cc in condData) {
                sum3 += condData[cc];
            }
            var condAve = sum3 / condData.length;
            var segCost = streetLen * streetWidth * (1/cond) * 5;
            var streetCost = sum * widthAve * (1/cond) * 5;
            document.getElementById('costs').innerHTML = '<br>Average condition of entire street in area: ' + parseFloat(condAve).toFixed(0) + "<br>Cost to update street segment: $" + parseFloat(segCost).toFixed(2) + "<br>Cost to update entire street in area: $" + parseFloat(streetCost).toFixed(2);

        }
    }
    request.send();
}

window.onload = function popHead() {
	var streetName = getVal(street, webby).replace(/%20/g, ' ');
    var cond = getVal(condition, webby);
	var objID = getVal(obj, webby);

	var streetCondition = getVal(condition, webby);


	document.getElementById('head').innerHTML = "<h2>Analysis for " + streetName + " segment from OBJECTID " + objID + "</h2>";
    document.getElementById('condition').innerHTML = "<h3>Condition: " + cond + "</h3>";
	getFullLength();

}
