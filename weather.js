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

  // display current window dimensions
  var width = window.innerWidth;
  var height = window.innerHeight;
  console.log(width,', ', height);

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

  // add weather icon class
  const weatherIcon = getWeatherIcon(weather);

  // Insert the info to the info panel
  panel.innerHTML = '';
  panel.innerHTML = `
    <i class="${weatherIcon}"></i>
    <p class="text-6xl mb-4">${temp.toFixed(1)}&#176;C</p>
    <p class="text-4xl">${city}, ${country}</p>
    <p>${localTime}</p>
  `
}

function createLeftPanel(data, panel) {
  panel.classList.add('flex', 'flex-col', 'p-8', 'text-center');
  
  const weather = data.weather[0].description;

  panel.innerHTML = '';
  panel.innerHTML = `
  <p class="text-6xl mb-4">${weather}</p>
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


/**
 * MAIN DOM MANIPULATION
 */

// Show the weather info of a city at start
getWeather('Guadalajara');