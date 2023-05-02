/**
 * MAIN FUNCTIONS
 */

function displayLoading() {
  const panelInfoMain = document.getElementById('panel-info-main');
  panelInfoMain.textContent = 'Waiting results';
}

function displayResults(data) {
  createMainWeatherInfoDivs(data);
}

function createMainWeatherInfoDivs(data) {
  // Get element
  const panelInfoMain = document.getElementById('panel-info-main');
  const panelInfoLeft = document.getElementById('panel-info-left');
  const panelInfoRight = document.getElementById('panel-info-right');
  panelInfoMain.innerHTML = '';
  panelInfoLeft.innerHTML = '';

  createMainPanel(data, panelInfoMain);
  createLeftPanel(data, panelInfoLeft);
  createRightPanel(data, panelInfoRight);
}

function createMainPanel(data, panel) {
  panel.classList.add('flex', 'flex-col', 'p-8', 'text-center');
  
  // Get relevant data
  const temp = data.main.temp;
  const city = data.name;
  const country = data.sys.country;
  const weather = data.weather[0].description
  // Transform data timezone to local readable timezone
  const localTime = toLocalTimeZone(data.timezone);

  // Add classes
  panel.classList.add('flex', 'flex-col', 'p-8', 'text-center');

  // get weather icon
  const weatherIcon = getWeatherIcon(weather);

  // Insert the info to the info panel
  panel.innerHTML = '';
  panel.innerHTML = `
    <p class="text-4xl mb-2">${weather}</p>
    <i class="${weatherIcon}"></i>
    <p class="text-6xl mb-4">${temp.toFixed(1)}&#176;C</p>
    <p class="text-4xl mb-2">${city}, ${country}</p>
    <p>${localTime}</p>
  `
}

function createLeftPanel(data, panel) {
  panel.classList.add('flex', 'flex-col', 'text-center');
  
  const weather = data.weather[0].description;

  [sunrise, sunset] = getSunriseAndSunset(data);

  panel.innerHTML = '';
  panel.innerHTML = `
  <div class="flex justify-center">
    <div class="info-panel text-2xl mb-4 p-2 flex flex-col">
      <div>
        <i class="wi wi-sunrise text-4xl"></i> Sunrise
      </div>
      <div class="text-3xl">
        ${sunrise}
      </div>
    </div>
    <div class="info-panel text-2xl mb-4 ml-2 p-2 flex flex-col">
      <div>
        <i class="wi wi-sunset text-4xl"></i> Sunset
      </div>
      <div class="text-3xl">
        ${sunset}
      </div>
    </div>
  </div>

  
  `
}

function createRightPanel(data, panel) {
  panel.classList.add('flex', 'flex-col', 'p-8', 'text-center');
  
  const humidity = data.main.humidity;

  panel.innerHTML = '';
  panel.innerHTML = `
    <p class="text-6xl mb-4">Humidity: ${humidity}</p>`
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


/**
 * AUXILIAR FUNCTIONS
 */

function toLocalTimeZone(timezone) {
  const timezoneOffset = timezone;
  const localTime = new Date().getTime();
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const cityTime = utc + (1000 * timezoneOffset);
  return new Date(cityTime).toLocaleString();
}

function getWeatherIcon(weather) {
  if (weather === 'clear sky') {
    return 'wi wi-day-sunny text-8xl my-6';
  }
  else if (weather === 'few clouds' || weather === 'broken clouds') {
    return 'wi wi-day-sunny-overcast text-8xl my-6';
  }
  else if (weather === 'overcast clouds') {
    return 'wi wi-day-cloudy text-8xl my-6';
  }
  return 'wi wi-solar-eclipse text-8xl my-6';
}

function getSunriseAndSunset(data) {

  // Get the user timezone
  var userTime = new Date();
  var userTimezoneOffset = userTime.getTimezoneOffset() * 60;

  // Get the current location timezone offset respect to UTC
  let cityTimezoneOffset = data.timezone;

  // Get the time for sunrise and sunset
  let sunrise = new Date(data.sys.sunrise * 1000);
  let sunset = new Date(data.sys.sunset * 1000);

  // substract user offset time and add city offset time
  sunrise.setSeconds(sunrise.getSeconds() + userTimezoneOffset + cityTimezoneOffset);
  sunset.setSeconds(sunset.getSeconds() + userTimezoneOffset + cityTimezoneOffset);

  return [sunrise.toLocaleTimeString(), sunset.toLocaleTimeString()];
}

/**
 * MAIN DOM MANIPULATION
 */

// Show the weather info of a city at start
getWeather('Guadalajara');