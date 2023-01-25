var historyButtonsEl = $('#history');
var currentDayHeading = $('<h2>');

var APIKey = "7346f2f976dfac403985b13d4b581099";

var cityName;
var lonCity;
var latCity;

var convertKelvinToCelsius = function(temp) {
    var temInCelsius = temp - 273.15;
    return temInCelsius.toFixed(2);

};

var getForecastElement = function(temp, windSpeed, humidity) {

    var forecastEl = $('<div>');
    forecastEl.addClass('col forecast-cards');

    forecastEl.append($('<p>').text("Temp: " + convertKelvinToCelsius(temp) + "\u00B0C"));
    forecastEl.append($('<p>').text("Wind: " + windSpeed +" KPH"));
    forecastEl.append($('<p>').text("Humidity: " + humidity +"%"));

    return forecastEl;

}

$('#search-button').on('click', function(event) {

    event.preventDefault();
    cityName = $('#search-input').val();

    historyButtonsEl.append($('<button>').text(cityName));

    $('#search-input').val('');

    var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=1&appid="+APIKey;

    $.ajax({

        url : queryURL,
        method : "GET"
    
    }).then(function(response) {
    
        console.log(response);
    
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
            imgIcon.attr('src', "http://openweathermap.org/img/wn/"+weatherList[0].weather[0].icon+"@2x.png");
            // imgIcon.css('display', 'inline');
            
            $('#today').append(currentDayHeading.text(response.city.name + " (" + formattedDate + ") ").append(imgIcon));
            $('#today').append($('<p>').text("Temp: " + convertKelvinToCelsius(weatherList[0].main.temp) + "\u00B0C"));
            $('#today').append($('<p>').text("Wind: " + weatherList[0].wind.speed+" KPH"));
            $('#today').append($('<p>').text("Humidity: " + weatherList[0].main.humidity+"%"));

            var forecastSectionEl = $('#forecast');

            for(var i=1; i<weatherList.length; i++) {

                if(dateList.includes(weatherList[i].dt_txt)) {

                    console.log(weatherList[i].dt_txt+" Formating **********");
                    

                    forecastSectionEl.append(getForecastElement(weatherList[i].main.temp, weatherList[i].wind.speed, weatherList[i].main.humidity));

                }

            }
        });

        $('#today').empty();

    });

});
// $.ajax({

//     url : queryURL,
//     method : "GET"

// }).then(function(response) {

//     console.log(response);

//     lonCity = response[0].lon;
//     latCity = response[0].lat;

//     console.log("longitude: "+lonCity+", latitude: "+latCity);

//     var queryURLFiveDay = "https://api.openweathermap.org/data/2.5/forecast?lat="+latCity+"&lon="+lonCity+"&appid="+APIKey;

    // $.ajax({

    //     url : queryURLFiveDay,
    //     method : "GET"

    // }).then(function(response) {

    //     console.log(response);
        //console.log("Five day forecast object: "+JSON.stringify(response));

        // --------------------------------------------------------------------------
        // var list = response.list;

        // for(var i=0; list.length; i++) {

        

        // // Create and save a reference to new empty table row
        //     var tableRowEl = $('<tr>');
        
        //     var addTdEl = function(respKey) {

        //     // Create and save references to 3 td elements containing the Title, Year, and Actors from the AJAX response object
        //     var tdEl = $('<td>');
        //     tdEl.text(respKey);

        //     // Append the td elements to the new table row
        //     tableRowEl.append(tdEl);

        //     }

        //     addTdEl(list[i].dt_txt);
        //     addTdEl(list[i].main.temp);
        //     //addTdEl(list[i].weather[0].icon);

        //     var tdIcon = $('<td>');
        //     var imgIcon = $('<img>');
        //     imgIcon.attr('src', "http://openweathermap.org/img/wn/"+list[i].weather[0].icon+"@2x.png");

        //     tdIcon.append(imgIcon);
        //     tableRowEl.append(tdIcon);
        
        //     //console.log(response);
        
        //     // Append the table row to the tbody element
        //     $('tbody').append(tableRowEl);
        // }

        //http://openweathermap.org/img/wn/10d@2x.png
        //10d is the code for icon
        // --------------------------------------------------------------------------

    //});

//});