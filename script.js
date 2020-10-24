var APIkey= "4d53ae91e1c539753bb289aa91936edd";

// Creates an event lister got search button response
$("#searchBtn").on("click", function()
{
  // Grabs user input 
  var varCity= $("#searchTxt").val();

  // Retrieve City values from storage to update it back into storage
  var previousCities = localStorage.getItem("previousCities");
  // Appends new city to string 
  previousCities += varCity;
  localStorage.setItem("previousCities", previousCities); 

  $("#searchOne").on("click", function()
  {

  });

  // API call for current weather
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${varCity}&appid=${APIkey}`,
    method: "GET"
  }).then(

    function(response) {
      $("#cityHeader").text(response.name + " " + moment().format('(L)'));
      $("#temp").text("Temperature: " + (((response.main.temp - 273.15) * 1.8) + 32).toFixed(1) + " \u00B0F");
      $("#humidity").text("Humidity: " + response.main.humidity + "%");
      $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
      
      // API call for UV index
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`,
        method: "GET"
      }).then(
        // Determines the UV index color
        function(UVresponse) {
          $("#UV").text("UV index: ");
          
          var UVrating="";

          if (UVresponse.value < 4)
          {
            UVrating = "favorable";
          } 
          else if (UVresponse.value <= 7)
          {
            UVrating = "moderate";
          }
          else 
          {
            UVrating = "severe";
          }

          //  Creates UV box
          var UVbox= $("<button/>", 
          {
            class: UVrating + " btn btn-sm",
            id: "UVseverity"
          });

          $("#UV").append(UVbox);
          $("#UVseverity").append(document.createTextNode(UVresponse.value));
        }
      )

      // API call for 5 day/ 3 hour forcast
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/forecast?q=${varCity}&appid=${APIkey}&units=imperial`,
        method: "GET" 
      }).then(

        function(responseForcast) {
          console.log(responseForcast);
          $("#dayOne").text((responseForcast.list[1].main.temp).toFixed(1) + "\u00B0F");
          $("#dayOneDate").text((moment(responseForcast.list[1].dt_txt)).format("L"));
          $("#dayOneHumidity").text("Humidity: " + responseForcast.list[1].main.humidity + "%");
          $("#dayOneTemp").text("Temp: " + (responseForcast.list[1].main.temp).toFixed(1) + "\u00B0F");

          $("#dayTwo").text((responseForcast.list[6].main.temp).toFixed(1) + "\u00B0F");
          $("#dayTwoDate").text((moment(responseForcast.list[6].dt_txt)).format("L"));
          $("#dayTwoHumidity").text("Humidity: " + responseForcast.list[6].main.humidity + "%");
          $("#dayTwoTemp").text("Temp: " + (responseForcast.list[6].main.temp).toFixed(1) + "\u00B0F");
        
          $("#dayThree").text((responseForcast.list[14].main.temp).toFixed(1) + "\u00B0F");
          $("#dayThreeDate").text((moment(responseForcast.list[14].dt_txt)).format("L"));
          $("#dayThreeHumidity").text("Humidity: " + responseForcast.list[14].main.humidity + "%");
          $("#dayThreeTemp").text("Temp: " + (responseForcast.list[14].main.temp).toFixed(1) + "\u00B0F");
        
          $("#dayFour").text((responseForcast.list[22].main.temp).toFixed(1) + "\u00B0F");
          $("#dayFourDate").text((moment(responseForcast.list[22].dt_txt)).format("L"));
          $("#dayFourHumidity").text("Humidity: " + responseForcast.list[22].main.humidity + "%");
          $("#dayFourTemp").text("Temp: " + (responseForcast.list[22].main.temp).toFixed(1) + "\u00B0F");
        
          $("#dayFive").text((responseForcast.list[30].main.temp).toFixed(1) + "\u00B0F");
          $("#dayFiveDate").text((moment(responseForcast.list[30].dt_txt)).format("L"));
          $("#dayFiveHumidity").text("Humidity: " + responseForcast.list[30].main.humidity + "%");
          $("#dayFiveTemp").text("Temp: " + (responseForcast.list[30].main.temp).toFixed(1) + "\u00B0F");

          $("#fiveDayForcast").css("visibility", "visible");
        }
      )
    },
    // Alerts when invalid input is entered
    function()
    {
      alert("Failed to retrieve data");
    }
  )
});