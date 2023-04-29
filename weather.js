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
  panelInfoMain.innerHTML = '';

  // Get relevant data
  const weather = data.weather[0].main;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const city = data.name;
  const country = data.sys.country;

  const timezoneOffset = data.timezone;
  const localTime = new Date().getTime();
  const localOffset = new Date().getTimezoneOffset() * 60000;
  const utc = localTime + localOffset;
  const cityTime = utc + (1000 * timezoneOffset);
  const localTimeCity = new Date(cityTime).toLocaleString();

  panelInfoMain.setAttribute('class', 'info-panel flex flex-col p-8 text-center');

  panelInfoMain.innerHTML = '';
  panelInfoMain.innerHTML = `
    <i class="wi wi-day-cloudy text-8xl my-6"></i>
    <p class="text-6xl mb-4">${temp.toFixed(1)}&#176;C</p>
    <p class="text-4xl">${city}, ${country}</p>
    <p>${localTimeCity}</p>
  `

  panelInfoMain.appendChild(panelInfoMain);
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

// Show the weather info of a city at start
getWeather('Guadalajara');