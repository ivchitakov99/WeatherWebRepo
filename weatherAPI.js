document.getElementById('weather-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var apiKey = '2ffbace46c991eecf127bb4936148108';
    var city = document.getElementById('city').value;

    // First, get the latitude and longitude of the city
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            var lat = data[0].lat;
            var lon = data[0].lon;

            // Then, use the latitude and longitude to get the weather data
            var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => displayWeather(data))
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
    
}); 



        
function displayWeather(data) {
    /*
    var weatherInfo = document.getElementById('weatherInfo');
    var content = '';
    */

    var forecast = data.list[0];
    var date = new Date(forecast.dt_txt);
    var timeOptions = { hour: '2-digit', minute: '2-digit' };
    var dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    var formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
    var formattedDate = date.toLocaleDateString('en-GB', dateOptions);
    var year = " '" + date.getFullYear().toString().substr(-2);
    var clouds = forecast.clouds.all + '%';
    var city = document.getElementById('city').value;

    
    var temp = document.querySelector('.div');
  
    temp.innerHTML = Math.round(forecast.main.temp - 273.15) + '°';

    document.querySelector('.city').innerHTML = city;

    var time_date = document.querySelector('.time-date');
    time_date.innerHTML = formattedTime + ' - ' + formattedDate + year;

    var weather_title = document.querySelector('.weather-details-information-title');
    weather_title.innerHTML = forecast.weather[0].description;


    // Select the degrees tag in the first group-parent div
    var tempMax = document.querySelector('.group-parent .div11');

    // Select the degrees tag in the second group-parent div
    var tempMin = document.querySelectorAll('.group-parent .div11')[1];

    // Now you can update their content
    tempMax.innerHTML = Math.round(forecast.main.temp_max - 273.15) + '°';
    tempMin.innerHTML = Math.round(forecast.main.temp_min - 273.15) + '°';

    var humidity = document.querySelector('.outline-parent .div13');
    var cloudiness = document.querySelector('.outline-group .div13');
    var wind = document.querySelector('.outline-container .kmh');

    humidity.innerHTML = forecast.main.humidity + '%';
    cloudiness.innerHTML = clouds;
    wind.innerHTML = Math.round(forecast.wind.speed*3.6) + 'km/h';


    console.log(forecast.weather[0].main);

    var title_img = document.getElementById('title-img');

    // Change the src attribute of the image tag
    title_img.src = './public/' + forecast.weather[0].main + '.png';
    title_img.style.display = 'block';
        
  /*
    content += 
    '<br>City: ' + city +
    '<br>Local time and date: ' + formattedTime + ' - ' + formattedDate + year +
    '<br>Image: ' + forecast.weather[0].main +
    '<br>Temperature is ' + Math.round(forecast.main.temp - 273.15) + '°C' +
    '<br>Weather conditions: ' + forecast.weather[0].description +
    '<br>Min Temperature: ' + Math.round(forecast.main.temp_min - 273.15) + '°C' +
    '<br>Max Temperature: ' + Math.round(forecast.main.temp_max - 273.15) + '°C' +
    '<br>Humidity: ' + forecast.main.humidity + '%' +
    '<br>Cloudiness: ' + clouds +
    '<br>Wind speed: ' + forecast.wind.speed + ' m/s'+
    '<br><br>';
    */

    // Determine the number of forecast cards
    let numForecastCards = 5; // Replace with the actual number of forecast cards

    // Iterate over each forecast card
    for (let i = 0; i < numForecastCards; i++) 
    {
        var forecast = data.list[i];
        var dateTime = new Date(forecast.dt_txt);
        var timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        var formattedTime = dateTime.toLocaleTimeString('en-GB', timeOptions);    

        // Generate the class name
        let className = '.forecast-card' + i;

        // Select the forecast card with the generated class name
        let forecastCard = document.querySelector(className);

        // Select the parent div within the current forecast card
        let parentDiv = forecastCard.querySelector('.parent');

        // Select the div1 and desc divs within the parent div
        let div1 = parentDiv.querySelector('.div1');
        div1.innerHTML = formattedTime;

        let desc = parentDiv.querySelector('.desc');
        desc.innerHTML= forecast.weather[0].main;

        // Select the div2 within the current forecast card
        let div2 = forecastCard.querySelector('.div2');
        div2.innerHTML= Math.round(forecast.main.temp - 273.15) + '°C';

        // Select the image within the current forecast card
        let image = forecastCard.querySelector('.desc-icon');

        // Change the src attribute of the image tag
        image.src = './public/' + forecast.weather[0].main + '.png';

        // Make the image visible
        image.style.display = 'block';

    }

    /*
    for (var i = 0; i < 5; i++) {
        var forecast = data.list[i];
        var dateTime = new Date(forecast.dt_txt);
        var timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        var formattedTime = dateTime.toLocaleTimeString('en-GB', timeOptions);

        
        content += 
        '<br>Image: ' + forecast.weather[0].main +
        '<br>Local time: ' + formattedTime +
        '<br>Description: ' + forecast.weather[0].main +
        '<br>Temperature is ' + Math.round(forecast.main.temp - 273.15) + '°C' +
        '<br><br>';
    }
    */
    /*
    weatherInfo.innerHTML = content;
    */
    
}
