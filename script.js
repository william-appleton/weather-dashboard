$(document).ready(function() {

    //Click event listener for search button -- makes API calls for today's weather (and the 5 day forecast from inside first call)
    $("#searchBtn").on("click", function () {
        let searchVal = $("#searchVal").val();

        $("#weatherToday").empty();

        weather(searchVal)   
    })

    //API call for today's weather
    function weather(searchVal) {
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchVal}&appid=6d73de0ac6b5f1f21e4c20898b07974d&units=imperial`,
            method: "GET"
        })

        .then(function(response) {
            let card = $("<div>").addClass("card")
            let cardBody = $("<div>").addClass("card-body")
            let title = $("<h2>").addClass("card-title").text(`${response.name}`) 
            let temp = $("<p>").addClass("card-text").text(`The temperature is ${response.main.temp} degrees F`)
            let wind = $("<p>").addClass("card-text").text(`The wind speed is ${response.wind.speed} MPH`)
            let humidity = $("<p>").addClass("card-text").text(`The humidity is ${response.main.humidity} %`)
            let icon = $("<img>").attr("src", `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
            
            title.append(icon)
            cardBody.append(title, temp, wind, humidity)
            card.append(cardBody)
            $("#weatherToday").append(card)
        
            //Function initialization for 5 day forecast and uv index
            
            $("weatherForecast").empty()

            forecast(searchVal)

            uvIndex(response.coord.lat, response.coord.lon)
        
            if (history.indexOf(searchVal) === -1) {
                history.push(searchVal);
                window.localStorage.setItem("history", JSON.stringify(history));
          
                appendRow(searchVal);
            }
        })
    }

    //API call for forecast (couldn't get this to append to html page)
    function forecast(searchVal) {

        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/forecast?q=${searchVal}&appid=6d73de0ac6b5f1f21e4c20898b07974d&units=imperial`,
            method: "GET"
        })

       
        .then(function(response) {
        
            for (let i=0; i<response.list.length; i++) {
                 if (response.list[i] % 5 == 0) {
                    let newColumn = $("<div>").addClass("col-md-2")
                    let card = $("<div").addClass("card")
                    let body = $("<div>").addClass("card-body")
                    let title = $("<h4>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString())
                    let icon = $("<img>").attr("src", `http://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`);
                    let temp = $("<p>").addClass("card-text").text(`Temp: ${response.list[i].main.temp_max} F`);
                    let humidity = $("<p>").addClass("card-text").text(`Humidity: ${response.list[i].main.humidity} %`);
                    
                    body.append(title, icon, temp, humidity)
                    card.append(body)
                    newColumn.append(card)
                    $("#weatherForecast").append(newColumn)
                }
            }
        })
    }

    //API for UV Index
    function uvIndex(lat, lon) {
        $.ajax({
          url: `http://api.openweathermap.org/data/2.5/uvi?appid=6d73de0ac6b5f1f21e4c20898b07974d&lat=${lat}&lon=${lon}`,
          method: "GET"
        })
          
        .then(function(response) {
        let uv = $("<p>").text("UV Index: ");
        let btn = $("<span>").addClass("btn btn-sm").text(response.value);
        
        if (response.value < 3) {
            btn.addClass("btn-success");
        }
        else if (response.value < 7) {
            btn.addClass("btn-warning");
        }
        else {
            btn.addClass("btn-danger");
        }
        
        $("#weatherToday .card-body").append(uv.append(btn));
        })
    }

    //Function to run weather search for past results
    $("#pastSearches").on("click", "li", function() {
        $("#weatherToday").empty() 
        weather($(this).text());
    })

    //Defining past searches array
    let history = JSON.parse(window.localStorage.getItem("history")) || [];

    if (history.length > 0) {
        weather(history[history.length-1]);
    }
    
    for (var i = 0; i < history.length; i++) {
        appendRow(history[i]);
    }

    //Function to append history list items
    function appendRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $("#pastSearches").append(li);
    }
})