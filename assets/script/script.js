var historyButtonsEl = $('#history');
var currentDayHeading = $('<h2>');
var forecastSectionEl = $('#forecast');
var cityList;

var APIKey = "7346f2f976dfac403985b13d4b581099";

var lonCity;
var latCity;

// Accepts the temperature in Kelvin and returns the temperature in Celsius.
var convertKelvinToCelsius = function(temp) {

    var temInCelsius = temp - 273.15;
    return temInCelsius.toFixed(2);

};

// This gets the forecast element which contains all the details of the forecast for the specified day.
var getForecastElement = function(date, icon, temp, windSpeed, humidity) {

    // Creates a moment object for the specified date.
    var m = moment(date, 'YYYY-MM-DD');

    // Creates a div container and adds the classes required, for creating cards, representing each day of the forecast.
    var forecastEl = $('<div>');
    forecastEl.addClass('col forecast-cards');

    // An image that contains the corresponding weather icon for the day.
    var imgIcon = $('<img>');
    imgIcon.attr('src', "https://openweathermap.org/img/wn/"+icon+"@2x.png");
    
    // Adds the date, icon, temperature, wind speed, and humidity details to the forecast card of the day.
    forecastEl.append($('<h4>').text(m.format('D/M/YYYY')));
    forecastEl.append(imgIcon);
    forecastEl.append($('<p>').text("Temp: " + convertKelvinToCelsius(temp) + "\u00B0C"));
    forecastEl.append($('<p>').text("Wind: " + windSpeed +" KPH"));
    forecastEl.append($('<p>').text("Humidity: " + humidity +"%"));

    // Returns the forecast element.
    return forecastEl;

};

var getWeatherDetails = function(cityName) {

    // Builds the query URL with the given city name and api key.
    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+APIKey;

    // This api call is made to get the corresponding latitude and longitude of the given city's location.
    $.ajax({

        url : queryURL,
        method : "GET"
    
    }).then(function(response) {
    
        // The response object will be empty if an invalid city is entered.
        if(response.length === 0) {
            alert("Please enter a valid city!");
            return;
        }
    
        // Stores the latitude and longitude value of the city from the response object.
        lonCity = response[0].lon;
        latCity = response[0].lat;
    
        console.log("longitude: "+lonCity+", latitude: "+latCity);

        // Building another query URL using the latitude and longitude values to get the 5 day weather forecast for the city.
        var queryURLFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat="+latCity+"&lon="+lonCity+"&appid="+APIKey;

        // This api call is made to get the current, and 5 day weather forecast for the city.
        $.ajax({

            url : queryURLFiveDay,
            method : "GET"

        }).then(function(response) {

            // The response object contains the 'list' of details of weather forecast for every 3 hours of 5 day forecast.
            var weatherList = response.list;

            // Stores the moment object for the current date
            var date = moment(weatherList[0].dt_txt, 'YYYY-MM-DD');
            var formattedDate = date.format('D/M/YYYY');
    
            // Contains the list of dates for the next five days.
            var dateList = [];
            var numList = 0;

            while(numList < 5){

                // Starting from the current day, 1 day is added every time, to get the list of dates for the next five days.
                date.add(1,'day');
                dateList.push(date.format('YYYY-MM-DD')+" 12:00:00");
                numList++;
            }

            // An image that contains the corresponding weather icon for the current day.
            var imgIcon = $('<img>');
            imgIcon.attr('src', "https://openweathermap.org/img/wn/"+weatherList[0].weather[0].icon+"@2x.png");
            
            // Adds styling for the elements containing the details of the current weather.
            $('#today').addClass('today-weather');

            // Adds the date, icon, temperature, wind speed, and humidity details of the current day.
            $('#today').append(currentDayHeading.text(response.city.name + " (" + formattedDate + ") ").append(imgIcon));
            $('#today').append($('<p>').text("Temp: " + convertKelvinToCelsius(weatherList[0].main.temp) + "\u00B0C"));
            $('#today').append($('<p>').text("Wind: " + weatherList[0].wind.speed+" KPH"));
            $('#today').append($('<p>').text("Humidity: " + weatherList[0].main.humidity+"%"));

            // Converts the string containing the city name to have the first letter in upper case, with the rest of the letters in lower case. 
            cityName=cityName[0].toUpperCase() + cityName.substring(1).toLowerCase();
            
            // Checks if the city name is not in the list of already searched cities, so that it can be added to the list.
            if(!cityList.includes(cityName)) {

                // Appends the new city name button element, which has not been searched before to the history buttons.
                historyButtonsEl.append($('<button>').text(cityName));

                // Adds the new city name to the list of cities that has been searched before.
                cityList.push(cityName);
        
                // Sets the cityList array to the local storage, for persistence.
                localStorage.setItem('cityNameList', JSON.stringify(cityList));
            }

            // Adding the header for the forecast details.
            $('<h4>').text("5-day Forecast:")
                        .addClass('mt-3')
                            .insertBefore(forecastSectionEl);

            // Loops through the whole list of weather details, which is obtained from the response object.
            for(var i=1; i<weatherList.length; i++) {

                // Checks if the weather list date corresponds to the dates in the date list. If it is included in the date list, the weather details are displayed by appending them to the forecast element.
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

// Function is called to get the list of cities that were searched previously, from the local storage.
var getInitialCityNameHistory = function() {

    let storageItem = localStorage.getItem('cityNameList');

    return JSON.parse(storageItem);
};

// The initial list of stored cities is assigned to cityList variable.
cityList = getInitialCityNameHistory();

if(cityList === null) {

    // The cityList variable is set to an empty array if its value is null.
    cityList = [];

} else {

    // Appends a button for each city that is contained in the cityList variable.
    $.each(cityList, function (i, val) {

        historyButtonsEl.append($('<button>').text(val));
         
    });
}

// Adds an event listener on the search button contained inside the form.
$('#search-button').on('click', function(event) {

    // Prevents the default behaviour of the submit button inside the form.
    event.preventDefault();

    // Gets the city name from the user input and stores it in the cityName variable.
    var cityName = $('#search-input').val();

    // This adds a validation to check if a value is entered in the input field.
    if(cityName === ''){
        alert("Please enter a city name");
        return;
    }

    // Clears the input field on clicking the submit button.
    $('#search-input').val('');

    // Gets the weather details and updates the screen.
    getWeatherDetails(cityName);
});

// Adds an event listener to all the buttons that represent the cities that have already been searched.
historyButtonsEl.on("click", "button", function(){
    
    // Gets the weather details for the city represented by the button, and displays in the application.
    getWeatherDetails($(this).text());

});
