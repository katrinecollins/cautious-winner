var searchHistory = JSON.parse(localStorage.getItem("city")) || [];

$("#searchButton").on("click", function () {
  var searchData = $("#weather-input").val().trim();

  callWeatherTemps(searchData);
});

function callWeatherTemps(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=6ec271a7eaa197efb35f9b736da2f3eb";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    searchHistory.unshift(response.name);

    searchHistory = Array.from(new Set(searchHistory));
    localStorage.setItem("cities", JSON.stringify(searchHistory));
    displaySearchHistory(searchHistory);

    $("#weather-append").empty();
    var fahrenheit = (
      (parseInt(response.main.temp - 273.15) * 9) / 5 +
      32
    ).toFixed() + " F";
    var humidity = response.main.humidity + "%";
    var wind = response.wind.speed;
    var cardBody = $("<div>").addClass("card-body");
    var cardTitle = $("<h3>")
      .addClass("card-title")
      .text(response.name + " " + new Date().toLocaleDateString());

    cardTitle.append(
      '<img src="http://openweathermap.org/img/wn/' +
        response.weather[0].icon +
        '.png" >'
    );

    var cardTemp = $("<p>").text("Temperature: " + fahrenheit);
    var cardHumidity = $("<p>").text("Humidity: " + humidity);
    var cardWind = $("<p>").text("Wind Speed: " + wind);

    $("#weather-append").append(
      cardBody,
      cardTitle,
      cardTemp,
      cardHumidity,
      cardWind
    );
    callUVIndex(response.coord.lat, response.coord.lon);
    callFiveDay(response.coord.lat, response.coord.lon);
  });
}

function callUVIndex(lat, lon) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=6ec271a7eaa197efb35f9b736da2f3eb";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    var uv = response.value;
    var cardUV = $("<p>").text("UV Index: " + uv);
    $("#weather-append").append(cardUV);
  });
}

function callFiveDay(lat, lon) {
  var queryURL =
    " https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=6ec271a7eaa197efb35f9b736da2f3eb";
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var dayArray = response.daily;

    $("#fiveday-append").empty();


    for (var i = 0; i < 5; i++) {
      var forecastWeather = dayArray[i + 1];
      var date = new Date(forecastWeather.dt * 1000);
      var fahrenheit = (
        (parseInt(forecastWeather.temp.day - 273.15) * 9) / 5 +
        32
      ).toFixed() + " F";

      
      var cardBody = $("<div>").addClass("card-body");
      var cardTitle = $("<h3>")
        .addClass("card-title")
        .text(date.toLocaleDateString());
      
       cardTitle.append(
        '<img src="http://openweathermap.org/img/wn/' +
          forecastWeather.weather[0].icon +
          '.png" >'
      );
      var cardTemp = $("<p>").text("Temperature: " + fahrenheit);
      
      $("#fiveday-append").append(cardBody, cardTitle, cardTemp);
    }
  });
}

function displaySearchHistory(cities) {

  $("#search-history").empty();
  for (var i = 0; i < cities.length; i++) {
    let city = cities[i];
    var li = $("<li>").addClass("list-group-item").text(city);
    li.on("click", function () {
      callWeatherTemps(city);
    });
    $("#search-history").append(li);
  }
}

displaySearchHistory(searchHistory);
