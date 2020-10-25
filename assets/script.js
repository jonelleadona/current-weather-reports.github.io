var APIkey = "4d53ae91e1c539753bb289aa91936edd";
var storedCitiesNum = 0;
var citiesMaxNum = 5;

// Count the number of cities currently in local storage
var cityHistoryString = localStorage.getItem("previousCities");

if (cityHistoryString === null)
{
  cityHistoryString = "";
}

for (var i = 0; i < cityHistoryString.length; ++i)
{
  if (cityHistoryString[i] === ";")
  {
    ++storedCitiesNum;
  }
}

// Display the search history
displayHistory();

// Parses city string from local storage and display
function displayHistory()
{
  var previousCities = localStorage.getItem("previousCities");
  var i = 1;
  
  while (previousCities !== "" && previousCities !== null)
  {
    var currentCity = previousCities.substring(0, previousCities.indexOf(";"));
    $("#city" + i).text(currentCity);
    $("#city" + i).css("visibility", "visible");
    previousCities = previousCities.substring(previousCities.indexOf(";") + 1);
    ++i;
  }
}

// Performs API calls to retrieve weather information
function retrieveWeatherData(city)
{
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`,
    method: "GET"
  }).then(

    function(response) {
      $(".currentDay").find(".city").text(response.name + " " + moment().format('(L)'));
      $(".currentDay").find(".icon").attr({
        src: "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
        alt: response.weather[0].description
      });
      $(".currentDay").find(".temp").text("Temperature: " + (response.main.temp).toFixed(1) + " \u00B0F");
      $(".currentDay").find(".humidity").text("Humidity: " + response.main.humidity + "%");
      $(".currentDay").find(".windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");

      console.log(response);
      
      // API call for UV index
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`,
        method: "GET"
      }).then(
        // Determines the UV index color
        function(UVresponse) {
          $(".currentDay").find(".UV").text("UV index: ");
          
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

          $(".currentDay").find(".UV").append(UVbox);
          $("#UVseverity").append(document.createTextNode(UVresponse.value));
        }
      )

      // API call for 5 day/ 3 hour forcast
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIkey}&units=imperial`,
        method: "GET" 
      }).then(
        function(responseForcast) {
          //console.log(responseForcast);

          var filterList = responseForcast.list.filter(function(date){
            return date.dt_txt.indexOf("03:00:00") > -1;
          });
            //console.log(filterList);
          
          filterList.forEach(function(date, i){
            $(".day" + (i+1)).find(".date").text(moment(date.dt_txt).format('L'));
            $(".day" + (i+1)).find(".icon").attr({
              src: "http://openweathermap.org/img/w/" + date.weather[0].icon + ".png",
              alt: date.weather[0].description
            });
            $(".day" + (i+1)).find(".temp").text("Temp: " + date.main.temp + "\u00B0F");
            $(".day" + (i+1)).find(".humidity").text("Humidity: " + date.main.humidity + "%");
          });

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
}

// Creates an event listener for search button response
$("#searchBtn").on("click", function()
{
  // Grabs user input 
  var varCity = $("#searchTxt").val();

  // Retrieve City values from storage to update it back into storage
  var previousCities = localStorage.getItem("previousCities");

  // If local storage is empty, getItem() returns null, so previousCities = null
  // That'd cause code to break so we want to set previousCities to an empty string instead
  if (storedCitiesNum === 0)
  {
    previousCities = "";
  }

  // Appends new city to string 
  previousCities += (varCity + ";");
  ++storedCitiesNum;

  if (storedCitiesNum > citiesMaxNum)
  {
    previousCities = previousCities.substring(previousCities.indexOf(";") + 1);
    --storedCitiesNum;
  };

  localStorage.setItem("previousCities", previousCities);
  
  displayHistory();

  // API call for current weather
  retrieveWeatherData(varCity);
});

for (var i = 1; i < 6; ++i)
{
  $("#city" + i).on("click", function()
  {
    retrieveWeatherData(this.textContent);
  });
}