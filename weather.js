function displayLoading() {
  const weatherInfo = document.getElementById('weather-info');
  weatherInfo.textContent = 'Waiting results';
}

function displayResults(data) {
  const weatherInfo = document.getElementById('weather-info');
  const weather = data.weather[0].description;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  
  weatherInfo.innerHTML = '';
  weatherInfo.textContent = 'Weather: ' + weather + ', ' + 'Temperature:' + temp + ', ' + 'Humidity: ' + humidity;
}

function getWeather(city) {
  const apiKey = "81383e7bd599e45d7534726f6e06fab2";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch and process results
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Unable to get the weather :(");
      }
    })
    .then((data) => {
      console.log(data);
      displayResults(data);
    })
    .catch((error) => {
      console.log(error);
    });

  // Show messages while fetching
  displayLoading();
}
