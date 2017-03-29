function getLocation() {
	$('#loading').html('<img src="./ajax-loader.gif">');
	$('#weather').html("");
	$('#alerts').html("");
	$('#forecast').html("");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		$('#weather').html("Geolocation is not supported by this browser.");
		$('#loading').html('');

	}
}

function showPosition(position) {
	console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);

	$.ajax({
		url : " http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude.toFixed(6) + "," + position.coords.longitude.toFixed(6) + "&sensor=true",
		dataType : "json",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			//console.log(items);
			try {
				var city = items.results[0].address_components[3].short_name;
				var state = items.results[0].address_components[5].short_name;
				getDataByCity(city, state);

			} catch(err) {
				console.log(err);
				var zip = items.results[0].address_components[7].short_name;
				getStationByZip(zip);

			}

		},
		error : function(parsed_json) {
			var items = parsed_json;
			$('#weather').html(items);
			$('#loading').html('');

		}
	});

}

window.onload = function init() {
	/*
	getData('KUTLAYTO1');
	$('.search').html('Search');
	$('.forecast').html('Forecast');
	$('.notice').html('Alerts');
	*/
	toggleView('search');
}
function getData(pws) {
	var x = $('#weather');
	$('#alerts').html("");
	$('#forecast').html("");
	x.html("");
	$('#loading').html('<img src="./ajax-loader.gif">');
	$.ajax({
		url : "https://api.wunderground.com/api/fe4f48d33c3b940a/geolookup/conditions/q/pws:" + pws + ".json",
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			console.log(items);
			if ( typeof items.response.error != "undefined") {
				x.html(items.response.error.description);
				$('#loading').html("");
				$('.location').html('Weather');

			} else {
				var co = items.current_observation;
				var lo = items.location;
				//console.log(items);

				var compassbearing = co.wind_degrees;
				var winddirection = co.wind_degrees + 180;
				if (winddirection > 360) {
					winddirection = winddirection - 360;
				}

				x.append('<b>' + co.weather + '</b><br> <img src="' + co.icon_url + '"> ');
				x.append('&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <img src="./arrow1.png" height="60px" width="auto" id="wind"><br>');
				$('#wind').css('transform', 'rotate(' + winddirection + 'deg)');
				x.append(co.wind_mph + ' mph wind<br>');
				x.append("Current temperature is " + co.temperature_string + '<br>');

				x.append('Feels like ' + co.feelslike_string + '<br>');

				x.append('Wind bearing ' + winddirection + ' degrees from ' + co.wind_degrees + ' degrees<br>');
				x.append(co.wind_string + '<br>');
				x.append('Humidity: ' + co.relative_humidity + '<br>');
				x.append('Dewpoint: ' + co.dewpoint_string + '<br>');
				x.append('Windchill: ' + co.windchill_string + '<br>');
				x.append('Solar Radiation: ' + co.solarradiation + '<br>');
				x.append('Heat Index: ' + co.heat_index_string + '<br>');
				if (co.precip_1hr_in < 0) {
					x.append('Precipitation Last Hour: 0.00 inches<br>');
				} else {
					x.append('Precipitation Last Hour: ' + co.precip_1hr_in + ' inches<br>');
				}
				if (co.precip_today_in < 0) {
					x.append('Precipitation Today: 0.00 inches<br>');
				} else {
					x.append('Precipitation Today: ' + co.precip_today_in + ' inches<br>');
				}
				x.append('Visibility: ' + co.visibility_mi + ' miles<br>');
				x.append('Barometric Pressure: ' + co.pressure_in + ' inch<br>');
				x.append(co.observation_time + '<br>');
				x.append('Observed From ' + co.observation_location.full + '<br>');
				x.append('StationID: ' + co.station_id + '<br>');
				x.append('Latitude: ' + co.observation_location.latitude + '<br>');
				x.append(' Longitude: ' + co.observation_location.longitude + '<br>');
				$('#loading').html("");
				$('.location').html('Weather for ' + lo.city + ", " + lo.state);

				//getAlerts(lo.city, lo.state);
				getForecast(co.observation_location.latitude, co.observation_location.longitude);
				toggleView('weather');
				$('#disweather').html('Current Conditions!');
				
			}
		},
		error : function(parsed_json) {
			var items = parsed_json;
			$('#weather').html(items);
			$('#loading').html('');
		}
	});
}

function cityState() {
	var city = $('#city').val();
	var state = $('#state').val();
	getDataByCity(city, state);
}

function getDataByCity(city, state) {
	var x = $('#weather');
	$('#wind').html("");
	$('#alerts').html("");
	$('#forecast').html("");
	x.html("");
	$('#loading').html('<img src="./ajax-loader.gif">');
	$.ajax({
		url : "https://api.wunderground.com/api/fe4f48d33c3b940a/geolookup/conditions/q/" + state + "/" + city + ".json",
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			//console.log(items);
			if ( typeof items.response.error != "undefined") {
				x.html(items.response.error.description);
				$('#loading').html("");
				$('.location').html('Weather');

			} else {
				var co = items.current_observation;
				var lo = items.location;
				//console.log(items);

				var compassbearing = co.wind_degrees;
				var winddirection = co.wind_degrees + 180;
				if (winddirection > 360) {
					winddirection = winddirection - 360;
				}

				x.append('<b>' + co.weather + '</b><br> <img src="' + co.icon_url + '"> ');
				x.append('&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <img src="./arrow1.png" height="60px" width="auto" id="wind"><br>');
				$('#wind').css('transform', 'rotate(' + winddirection + 'deg)');
				x.append(co.wind_mph + ' mph wind<br>');
				x.append("Current temperature is " + co.temperature_string + '<br>');

				x.append('Feels like ' + co.feelslike_string + '<br>');

				x.append('Wind bearing ' + winddirection + ' degrees from ' + co.wind_degrees + ' degrees<br>');
				x.append(co.wind_string + '<br>');
				x.append('Humidity: ' + co.relative_humidity + '<br>');
				x.append('Dewpoint: ' + co.dewpoint_string + '<br>');
				x.append('Windchill: ' + co.windchill_string + '<br>');
				x.append('Solar Radiation: ' + co.solarradiation + '<br>');
				x.append('Heat Index: ' + co.heat_index_string + '<br>');
				if (co.precip_1hr_in < 0) {
					x.append('Precipitation Last Hour: 0.00 inches<br>');
				} else {
					x.append('Precipitation Last Hour: ' + co.precip_1hr_in + ' inches<br>');
				}
				if (co.precip_today_in < 0) {
					x.append('Precipitation Today: 0.00 inches<br>');
				} else {
					x.append('Precipitation Today: ' + co.precip_today_in + ' inches<br>');
				}
				x.append('Visibility: ' + co.visibility_mi + ' miles<br>');
				x.append('Barometric Pressure: ' + co.pressure_in + ' inch<br>');
				x.append(co.observation_time + '<br>');
				x.append('Observed From ' + co.observation_location.full + '<br>');
				x.append('StationID: ' + co.station_id + '<br>');
				x.append('Latitude: ' + co.observation_location.latitude + '<br>');
				x.append(' Longitude: ' + co.observation_location.longitude + '<br>');
				$('#loading').html("");
				$('.location').html('Weather for ' + lo.city + ", " + lo.state);

				getForecast(co.observation_location.latitude, co.observation_location.longitude);
				toggleView('weather');
				$('#disweather').html('Current Conditions!');
				//getAlerts(lo.city, lo.state);
			}
		},
		error : function(parsed_json) {
			var items = parsed_json;
			$('#weather').html(items);
			$('#loading').html('');

		}
	});
}

function getStationByZip(zip) {
	var x = $('#weather');
	$('#alerts').html("");
	$('#forecast').html("");
	$('#wind').html("");
	x.html("");
	var loc, city, state;
	$.ajax({
		url : "https://api.wunderground.com/api/fe4f48d33c3b940a/geolookup/q/" + zip + ".json",
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			//console.log(items);
			try {
				loc = (items.location.nearby_weather_stations.pws.station[0].id);
				getData(loc);
			} catch(err) {
				console.log(err);
				city = items.location.city;
				state = items.location.state;
				getDataByCity(city, state);
			}
		},
		error : function(parsed_json) {
			var items = parsed_json;
			$('#weather').html(items);
			$('#loading').html('');

		}
	});
}

function getAlerts(city, state) {
	$('#loading').html('<img src="./ajax-loader.gif">');
	$('#alerts').html("");
	$.ajax({
		url : "https://api.wunderground.com/api/fe4f48d33c3b940a/alerts/q/" + state + "/" + city + ".json",
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			//console.log(items);
			if (items.alerts.length == 0) {
				$('#alerts').html('No alerts at this time');
				$('#loading').html('');
				$('.notice').html('Alert');
				getAstro(city, state);
			} else {
				$('.notice').html('Alert!!!');
				$('#alerts').html(items.alerts[0].description + ':<br>');
				$('#alerts').append(items.alerts[0].message + '<br>');
				$('#alerts').append('Expires: ' + items.alerts[0].expires)
				$('#loading').html('');
				getAstro(city, state);
			}
		},
		error : function() {
			$('#alerts').html('Error collecting alert data');
			$('.notice').html('Alert');
			$('#loading').html('');
			getAstro(city, state);
		}
	});
}

function getAstro(city, state) {
	var x = $('#weather');
	$('#loading').html('<img src="./ajax-loader.gif">');
	$.ajax({
		url : "https://api.wunderground.com/api/fe4f48d33c3b940a/astronomy/q/" + state + "/" + city + ".json",
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			var co = items.current_observation;
			var lo = items.location;
			//console.log(items);
			x.append('Sunrise: ' + items.sun_phase.sunrise.hour + ":" + items.sun_phase.sunrise.minute + '<br>');
			x.append('Sunset: ' + items.sun_phase.sunset.hour + ":" + items.sun_phase.sunset.minute + '<br>');
			x.append('Moon Phase: ' + items.moon_phase.phaseofMoon + '<br>');
			x.append('Moon Illumination: ' + items.moon_phase.percentIlluminated + '%<br>');
			x.append('Moon Age: ' + items.moon_phase.ageOfMoon + '<br>');

			$('loading').html('');
		}
	});
}

function getForecast(lat, lon) {
	var urlSend = ("https://api.darksky.net/forecast/5a5d01b70294b9738a1af6ddb9451cb7/f478a269867c5f9ce580020d86e6c409/" + lat + "," + lon);
	console.log(urlSend);
	var x = $('#forecast');
	var a = $('#alerts');
	x.html("");
	a.html("");

	var thePrecip, date, date1, date2, timeSunrise, timeSunset;

	$.ajax({
		url : urlSend,
		crossDomain : true,
		dataType : "jsonp",
		crossDomain : true,
		success : function(parsed_json) {
			var items = parsed_json;
			//console.log("api forcast:");
			//console.log(items);
			if (items.alerts != undefined) {
				a.append(items.alerts[0].description);
				$('#disalerts').html('Alert!!!');
			} else {
				a.append('No alerts for this area at this time.');
			}
			var data = items.daily.data;
			
			x.append('Summary for the week: ' + items.daily.summary + '<br><br>');
			for (var i=0;i<data.length;i++) {
				date = new Date(data[i].sunriseTime * 1000);
				date1 = String(date);
				date2 = date1.substring(0,11);
				x.append('<b>' + date2 + ': </b> ' + data[i].summary + '<br>' );
				x.append('High: ' + data[i].temperatureMax + '<br>');
				x.append('Low: ' + data[i].temperatureMin + '<br>');
				thePrecip = data[i].precipProbability * 100;
				x.append('Chance of ' + data[i].precipType + ' ' + thePrecip + '%<br>');

				timeSunrise = date1.substring(16,25);
				date = new Date(data[i].sunsetTime * 1000);
				date1 = String(date);
				timeSunset = date1.substring(16,25);
				
				x.append('Sunrise: ' + timeSunrise + '<br>');
				x.append('Sunset: ' + timeSunset + '<br>');
				x.append('Moonphase: ' + data[i].moonPhase + '<br><br>');
			}

			$('loading').html("");
			getHourly(items.hourly.data);
			$('#disforecast').html('Forecast!');
		},
		error : function() {
			$("#forecast").html("No forecast data available at this time.");
		}
	});
}

function getHourly(obj) {
	
	d3.select('#hourly').html("");
	
	var dvals = [];
	for (var ii = 0; ii < obj.length; ii++) {
		dvals.push(obj[ii].temperature);
	}

	for (var ii = 0; ii < obj.length; ii++) {
		var theTime = new Date(obj[ii].time * 1000);
		theTime = theTime.getUTCFullYear() + " " + String(theTime.getMonth() + 1) + " " + String(theTime.getDate() + " " + theTime.getHours()) + ":00";
		//console.log(theTime);
		obj[ii]['temporal'] = theTime;
	}	
	//console.log(obj);
	var bardata = obj;
/* Bar Graph
	var height = 800
	width = 1200
	barWidth = 5, barOffset = 2;

	var colors = d3.scale.category20();
	var yScale = d3.scale.linear().domain([0, d3.max(dvals)]).range([10, height])

	var xScale = d3.scale.ordinal().domain(d3.range(0, dvals.length)).rangeBands([0, width])

	var tooltip = d3.select('#hourly').append('div').style('position', 'absolute').style('padding', '0 10px').style('background', 'white').style('opacity', 0)

	var myChart = d3.select('#hourly').append('svg').attr('width', width).attr('height', height).selectAll('rect').data(obj).enter().append('rect').style('fill', function(d, i) {
		return colors(i);
	})
	//.style('fill', colors)
	.attr('width', xScale.rangeBand()).attr('x', function(d, i) {
		return xScale(i);
	}).attr('height', 0).attr('y', height).on('mouseover', function(d) {
		tooltip.transition().style('opacity', .9)

		tooltip.html(d.temporal + " " + d.temperature)

		d3.select(this).transition().style('opacity', .5)
	}).on('mouseout', function(d) {
		d3.select(this).transition().style('opacity', 1)
	})

	myChart.transition().attr('height', function(d) {
		return yScale(d.temperature);
	}).attr('y', function(d) {
		return height - yScale(d.temperature);
	})
	*/
	
	var margin = {
		top : 20,
		right : 20,
		bottom : 30,
		left : 50
	}, width = 1200 - margin.left - margin.right, height = 800 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y %m %d %H:%M").parse;

	var x = d3.time.scale().range([0, width]);

	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");

	var yAxis = d3.svg.axis().scale(y).orient("left");

	var line = d3.svg.line().x(function(d) {
		return x(d.temporal);
	}).y(function(d) {
		return y(d.temperature);
	});

	var svg = d3.select("#hourly").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
	.attr("fill", "white")
	.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data = obj;
	data.forEach(function(d) {
		d.temporal = parseDate(d.temporal);
		d.temperature = +d.temperature;
	});

	x.domain(d3.extent(data, function(d) {
		return d.temporal;
	}));
	y.domain(d3.extent(data, function(d) {
		return d.temperature;
	}));

	svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("");

	svg.append("path").datum(obj).attr("class", "line").attr("d", line);
	$('#dishourly').html('Hourly Temperature!');
}

$(function() {
	$("input[type=submit], a, button").button().click(function(event) {
		event.preventDefault();
	});
});

function toggleView(id) {
	$(".win").hide();
	$("#" + id).show();
	$(".pil").css("color", "#2176C7");
	$("#dis" + id).css("color", "red");
}
