$(document).ready(function() {

    $("#searchBtn").on("click", function () {
        let searchVal = $("#searchVal").val();

        $("#weatherToday").empty();

        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/weather?q=${searchVal}&appid=6d73de0ac6b5f1f21e4c20898b07974d&units=imperial`,
            method: "GET"
        })

        .then(function(response) {
            console.log(response)

           let card = $("<div>").addClass("card")
           let cardBody = $("<div>").addClass("card-body")
           let title = $("<h2>").addClass("card-title").text(`Today's Weather for ${response.name}`) 
           let temp = $("<p>").addClass("card-text").text(`The temperature is ${response.main.temp} degrees F`)
           let wind = $("<p>").addClass("card-text").text(`The wind speed is ${response.wind.speed} MPH`)
           let humidity = $("<p>").addClass("card-text").text(`The humidity is ${response.main.humidity} %`)
           let icon = $("<img>").attr("src", `http://openweathermap.org/img/w/${response.weather[0].icon}.png`);
           
           title.append(icon)
           cardBody.append(title, temp, wind, humidity)
           card.append(cardBody)
           $("#weatherToday").append(card)
        })
    })

})