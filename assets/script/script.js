var historyButtonsEl = $('#history');
var currentDayHeading = $('<h2>');
var forecastSectionEl = $('#forecast');
var cityList;

var APIKey = "7346f2f976dfac403985b13d4b581099";

var lonCity;
var latCity;

var convertKelvinToCelsius = function(temp) {

    var temInCelsius = temp - 273.15;
    return temInCelsius.toFixed(2);

};

var getForecastElement = function(date, icon, temp, windSpeed, humidity) {

    var m = moment(date, 'YYYY-MM-DD');
    var forecastEl = $('<div>');
    forecastEl.addClass('col forecast-cards');

    var imgIcon = $('<img>');
    imgIcon.attr('src', "http://openweathermap.org/img/wn/"+icon+"@2x.png");
                    
    //console.log(m.format('D/M/YYYY')+" Formating **********");
    forecastEl.append($('<h4>').text(m.format('D/M/YYYY')));
    forecastEl.append(imgIcon);
    forecastEl.append($('<p>').text("Temp: " + convertKelvinToCelsius(temp) + "\u00B0C"));
    forecastEl.append($('<p>').text("Wind: " + windSpeed +" KPH"));
    forecastEl.append($('<p>').text("Humidity: " + humidity +"%"));

    return forecastEl;

};

var getWeatherDetails = function(cityName) {

    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+APIKey;

    $.ajax({

        url : queryURL,
        method : "GET"
    
    }).then(function(response) {
    
        console.log(response);
        if(response.length === 0) {
            alert("Please enter a valid city!");
            return;
        }
    
        lonCity = response[0].lon;
        latCity = response[0].lat;
    
        console.log("longitude: "+lonCity+", latitude: "+latCity);

        var queryURLFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat="+latCity+"&lon="+lonCity+"&appid="+APIKey;

        $.ajax({

            url : queryURLFiveDay,
            method : "GET"

        }).then(function(response) {

            console.log(response);

            var weatherList = response.list;
            var date = moment(weatherList[0].dt_txt, 'YYYY-MM-DD');
            var formattedDate = date.format('D/M/YYYY');
    
            var dateList = [];
            var numList = 0;

            while(numList < 5){
                date.add(1,'day');
                dateList.push(date.format('YYYY-MM-DD')+" 12:00:00");
                numList++;
            }
            console.log("Date List");
            $.each(dateList, function (i, val) { 
                 console.log(val);
            });

            var imgIcon = $('<img>');
            imgIcon.attr('src', "https://openweathermap.org/img/wn/"+weatherList[0].weather[0].icon+"@2x.png");
            
            $('#today').addClass('today-weather');
            $('#today').append(currentDayHeading.text(response.city.name + " (" + formattedDate + ") ").append(imgIcon));
            $('#today').append($('<p>').text("Temp: " + convertKelvinToCelsius(weatherList[0].main.temp) + "\u00B0C"));
            $('#today').append($('<p>').text("Wind: " + weatherList[0].wind.speed+" KPH"));
            $('#today').append($('<p>').text("Humidity: " + weatherList[0].main.humidity+"%"));

            cityName=cityName[0].toUpperCase() + cityName.substring(1).toLowerCase();
            
            if(!cityList.includes(cityName)) {
                historyButtonsEl.append($('<button>').text(cityName));
                cityList.push(cityName);
        
                localStorage.setItem('cityNameList', JSON.stringify(cityList));
            }

            // Adding the header for the forecast details.
            $('<h4>').text("5-day Forecast:")
                        .addClass('mt-3')
                            .insertBefore(forecastSectionEl);

            for(var i=1; i<weatherList.length; i++) {

                if(dateList.includes(weatherList[i].dt_txt)) {

                    forecastSectionEl.append(
                        getForecastElement(
                            weatherList[i].dt_txt,
                            weatherList[i].weather[0].icon,
                            weatherList[i].main.temp, 
                            weatherList[i].wind.speed, 
                            weatherList[i].main.humidity
                        )
                    );

                }

            }
        });

        // Removing the weather details of current city before displaying the weather for next city.
        $('#today').empty();
        forecastSectionEl.empty();
        
        // Removing the header element before the detailed 5 day forecast.
        forecastSectionEl.prev('h4').remove();

    });

};

var getInitialCityNameHistory = function() {

    let storageItem = localStorage.getItem('cityNameList');

    return JSON.parse(storageItem);
};

cityList = getInitialCityNameHistory();

if(cityList === null) {
    cityList = [];
} else {
    $.each(cityList, function (i, val) {

        historyButtonsEl.append($('<button>').text(val));
         
    });
}

console.log(cityList);

$('#search-button').on('click', function(event) {

    event.preventDefault();
    var cityName = $('#search-input').val();

    $('#search-input').val('');

    getWeatherDetails(cityName);
});

historyButtonsEl.on("click", "button", function(){
    
    console.log($(this).text());
    getWeatherDetails($(this).text());

});
