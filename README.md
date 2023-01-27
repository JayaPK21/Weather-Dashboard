# Weather Dashboard

## Description

This application is used to display the weather details for the current day, and the forecast for the next five days, in any given city. It uses the Openweathermap API, to get the weather details. The list of cities that have been searched previously are persisted using local storage, and retrieved on page refresh. Following steps were taken in building the application:

* Using the city name, an API call is made to retrieve the longitude and latitude values of the location of the city.

* Another API call is made with the values retrieved above to get the weather forecast of the next five days for the given city.

* Since the API returns the weather details for every 3 hours for 5 days, the application displays the weather forecast details at 12 noon for every day of the five day forecast.

* The details of the weather are dynamically updated in the website using jQuery.

* When a new city is searched, a new button is created for it and stored. These buttons can be used to get the weather details again for the corresponding city.

## Installation

The application can be accessed at the following website:

https://jayapk21.github.io/Weather-Dashboard/

## Usage

The following screenshot shows a sample of how the application can be used.

![An image of the application containing the weather forecast details for the city of London.](assets/screenshots)