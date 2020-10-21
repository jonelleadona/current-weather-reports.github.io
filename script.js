var APIkey= "4d53ae91e1c539753bb289aa91936edd";

$("#searchBtn").on("click",function()
{
  // Grabs user input 
  var varCity= $("#searchTxt").val();
  

  // Holds city search (add list for 8 cities) 
  //localStorage.setItem("cityValue", varCity); 
  

  // AJAX call is made here
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${varCity}&appid=${APIkey}`,
    method: "GET"
  }).then(
    function(response) {
      $("#cityHeader").text(response.name + " " + moment().format('(L)'));
      $("#temp").text("Temperature: " + (((response.main.temp - 273.15) * 1.8) + 32).toFixed(1) + " \u00B0F");
      $("#humidity").text("Humidity: " + response.main.humidity + "%");
      $("#windSpeed").text("Wind Speed: " + response.wind.speed + " MPH");
      
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`,
        method: "GET"
      }).then(
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

          var UVbox= $("<button/>", 
          {
            class: UVrating + " btn btn-primary btn-sm",
            id: "UVseverity"
          });

          $("#UV").append(UVbox);

          $("#UVseverity").append(document.createTextNode(UVresponse.value));

        }
      )
    },
    function()
    {
      alert("Failed to retrieve data")
    }

  );
});



