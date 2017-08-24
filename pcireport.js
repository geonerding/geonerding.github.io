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

function popHead() {
	var streetName = getEm(street, webby);
	document.getElementById('head').innerHTML = "Analysis for " + streetName;
}