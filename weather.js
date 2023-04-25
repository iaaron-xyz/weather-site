function displayLoading() {
  const weatherInfoDiv = document.getElementById('weather-info');
  weatherInfoDiv.textContent = 'Waiting results';
}

function displayResults(data) {
  createMainCard(data);
}

function createMainCard(data) {
  // Get element
  const weatherInfoDiv = document.getElementById('weather-info');
  weatherInfoDiv.innerHTML = '';

  // Get relevant data
  const weather = data.weather[0].main;
  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const city = data.name;
  const country = data.sys.country;

  const mainInfoCard = document.createElement('div');
  mainInfoCard.setAttribute('id', 'main-info-card');
  mainInfoCard.setAttribute('class', 'border border-sky-500 flex flex-col p-8 rounded-lg text-center');

  mainInfoCard.innerHTML = '';
  mainInfoCard.innerHTML = `
    <i class="wi wi-day-cloudy text-8xl my-6"></i>
    <p class="text-6xl mb-4">${temp}</p>
    <p class="text-4xl">${city}, ${country}</p>
  `

  weatherInfoDiv.appendChild(mainInfoCard);
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
getWeather('Seul');
