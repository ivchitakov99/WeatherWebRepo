// Set the default city
var defaultCity = 'Burgas';

// Fetch the weather data for the default city
fetchWeatherData(defaultCity);

function fetchWeatherData(city) {
  var apiKey = '2ffbace46c991eecf127bb4936148108';

  // First, get the latitude and longitude of the city
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var cityName = data[0].name;

      // Then, use the latitude and longitude to get the weather data
      var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeather(data, cityName))
        .catch(error => console.error('Error:', error));
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('weather-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var city = document.getElementById('city').value;
  fetchWeatherData(city);
});

function displayWeather(data, cityName) {
  var forecast = data.list[0];
  var date = new Date(forecast.dt_txt);
  var timeOptions = { hour: '2-digit', minute: '2-digit' };
  var dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  var formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
  var formattedDate = date.toLocaleDateString('en-GB', dateOptions);
  var year = " '" + date.getFullYear().toString().substr(-2);
  var clouds = forecast.clouds.all + '%';

  var temp = document.querySelector('.div');
  temp.innerHTML = Math.round(forecast.main.temp - 273.15) + '°';

  document.querySelector('.city').innerHTML = cityName;

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

  var title_img = document.getElementById('title-img');
  title_img.src = './public/' + forecast.weather[0].main + '.png';
  title_img.style.display = 'block';

  let numForecastCards = 5;

  for (let i = 0; i < numForecastCards; i++) {
    var forecast = data.list[i];
    var dateTime = new Date(forecast.dt_txt);
    var timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    var formattedTime = dateTime.toLocaleTimeString('en-GB', timeOptions);

    let className = '.forecast-card' + i;
    let forecastCard = document.querySelector(className);
    let parentDiv = forecastCard.querySelector('.parent');
    let div1 = parentDiv.querySelector('.div1');
    div1.innerHTML = formattedTime;
    let desc = parentDiv.querySelector('.desc');
    desc.innerHTML= forecast.weather[0].main;
    let div2 = forecastCard.querySelector('.div2');
    div2.innerHTML= Math.round(forecast.main.temp - 273.15) + '°C';
    let image = forecastCard.querySelector('.desc-icon');
    image.src = './public/' + forecast.weather[0].main + '.png';
    image.style.display = 'block';
  }
}


let searchHistory = [];

document.getElementById('weather-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var city = document.getElementById('city').value;
  fetchWeatherData(city);
  
  if (!searchHistory.includes(city)) {
    addToSearchHistory(city);
  }
  
});

document.getElementById('search-history-btn').addEventListener('click', function() {
  toggleSearchHistory();
});

function addToSearchHistory(city) {
  searchHistory.push(city);
  updateSearchHistory();
  saveSearchHistory();
}

function updateSearchHistory() {
  const searchHistoryList = document.getElementById('search-history-list');
  searchHistoryList.innerHTML = '';

  searchHistory.forEach((city) => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
      fetchWeatherData(city);
      toggleSearchHistory();
    });
    searchHistoryList.appendChild(listItem);
  });
}

function saveSearchHistory() {
  sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function loadSearchHistory() {
  const storedHistory = sessionStorage.getItem('searchHistory');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
    updateSearchHistory();
  }
}

function toggleSearchHistory() {
  const searchHistoryContainer = document.querySelector('.search-history-container');
  const screenOverlay = document.querySelector('.screen-overlay');
  /*const bgBlurContainer = document.querySelector('.bg-blur');*/

  if (searchHistoryContainer.style.display === 'none') {
    searchHistoryContainer.style.display = 'block';
    screenOverlay.style.display = 'block';
    /*bgBlurContainer.style.display = 'none';*/
  } else {
    searchHistoryContainer.style.display = 'none';
    screenOverlay.style.display = 'none';
    /*bgBlurContainer.style.display = 'flex';*/
  }
}


loadSearchHistory();

const searchHistoryContainer = document.querySelector('.search-history-container');
const screenOverlay = document.querySelector('.screen-overlay');
const closeBtn = document.querySelector('.close-btn');
const homeDesktopChild = document.querySelector('.home-desktop-child');

closeBtn.addEventListener('click', toggleSearchHistory);


document.addEventListener('click', (event) => {
  if (searchHistoryContainer.style.display === 'block') {
    if (!searchHistoryContainer.contains(event.target) && !homeDesktopChild.contains(event.target) && event.target !== document.getElementById('search-history-btn')) {
      toggleSearchHistory();
    }
  }
});