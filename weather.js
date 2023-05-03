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

function displayForecastResults(dataforecast, data) {
  const panelInfoRight = document.getElementById('panel-info-right');
  createRightPanel(dataforecast, data, panelInfoRight);
}

function createMainWeatherInfoDivs(data) {
  // Get element
  const panelInfoMain = document.getElementById('panel-info-main');
  const panelInfoLeft = document.getElementById('panel-info-left');
  
  panelInfoMain.innerHTML = '';
  panelInfoLeft.innerHTML = '';

  createMainPanel(data, panelInfoMain);
  createLeftPanel(data, panelInfoLeft);
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
    <i class="${weatherIcon} text-8xl my-6"></i>
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
  <div class="grid grid-cols-2 gap-3">

  <!--Sunrise and sunset -->
    <div>
      <div>
        <i class="wi wi-sunrise text-4xl mr-1"></i> Sunrise
      </div>
      <div class="text-3xl">
        ${sunrise}
      </div>
    </div>
    <div>
      <div>
        <i class="wi wi-sunset text-4xl mr-1"></i> Sunset
      </div>
      <div class="text-3xl">
        ${sunset}
      </div>
    </div>

    <div>
      <div>
        <i class="wi wi-humidity text-4xl mr-1"></i> Humidity
      </div>
      <div class="text-3xl">
        ${data.main.humidity}
      </div>
    </div>
    <div>
      <div>
        <i class="wi wi-barometer text-4xl mr-1"></i> Pressure
      </div>
      <div class="text-3xl">
        ${data.main.pressure} Pa
      </div>
    </div>
  </div>

  <div>
    <div>
      <i class="wi wi-strong-wind text-4xl mr-1"></i> Windspeed
    </div>
    <div class="text-3xl">
      ${data.wind.speed} m/s
    </div>
  </div>

  </div>
  `
}

function createRightPanel(dataforecast, data, panel) {
  panel.classList.add('flex', 'flex-col', 'text-center');

  // number of elements to 
  const numberOfItems = 4;
  
  // Get first 4 weather descriptions
  const futureWeatherDescription = dataforecast.list.slice(0, numberOfItems).map(item => item.weather[0].description);
  //  Get temperatures
  const futureWeatherTemp = dataforecast.list.slice(0, numberOfItems).map(item => item.main.temp);
  //  Get temperatures
  const futureWeatherHour = dataforecast.list.slice(0, numberOfItems).map(item => item.dt);  

  const dateTime = "2023-05-03 00:00:00";
  const time = dateTime.split(" ")[1].split(":")[0];

  // weather info
  panel.innerHTML = '';
  for (let i = 0; i < numberOfItems; i += 1) {
    panel.innerHTML += `
      <div class="info-panel flex justify-center mb-2 px-2 pl-4">
        <div class="mr-4">
          <i class="${getWeatherIcon(futureWeatherDescription[i])} text-6xl mt-6"></i>
          <div class="mb-2">${futureWeatherDescription[i]}</div>
        </div>
        <div class="flex flex-col justify-center px-4">
          <div class="text-xl mb-2">${toLocalTime(futureWeatherHour[i], data)}</div>
          <div class="text-2xl">${futureWeatherTemp[i].toFixed(1)}&#176;C</div>
        </div>
        </div>`
  }
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
      // Obtiene la temperatura futura
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(dataforecast => {
          displayForecastResults(dataforecast, data);
        })
        .catch(error => console.error(error));
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

function toLocalTime(timeInSeconds, data) {

  // Get the user timezone
  var userTime = new Date();
  var userTimezoneOffset = userTime.getTimezoneOffset() * 60;

  // Get the current location timezone offset respect to UTC
  let cityTimezoneOffset = data.timezone;

  // to readable time
  let date = new Date(timeInSeconds * 1000);

  // to local time
  date.setSeconds(date.getSeconds() + userTimezoneOffset + cityTimezoneOffset);

  const dateSplitted = date.toLocaleTimeString().split(':');
  
  // Get the hour and minutes
  return localHour = `${dateSplitted[0]}:${dateSplitted[1]}`;
}

function getWeatherIcon(weather) {
  if (weather === 'clear sky') {
    return 'wi wi-day-sunny';
  }
  else if (weather === 'few clouds' || weather === 'broken clouds' || weather === 'scattered clouds') {
    return 'wi wi-day-sunny-overcast';
  }
  else if (weather === 'overcast clouds') {
    return 'wi wi-day-cloudy';
  }
  return 'wi wi-solar-eclipse';
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