// Define constants and get HTML elements
const apiKey = '5fdd64f174340e34d96c70b1925f05f8';
const forecastContainer = document.getElementById('forecast-container');
const todayForecastDetails = document.getElementById('today-forecast-details');
const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');

// Function to fetch weather data from OpenWeatherMap API
async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('Weather data not available for the provided city.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        throw error;
    }
}

// Function to display the forecast on the page
function displayForecast(data) {
    forecastContainer.innerHTML = '';
    todayForecastDetails.innerHTML = '';
    const dailyForecasts = {};

    // Access the list property of the data object
    const forecast = data.list;

    forecast.forEach(entry => {
        const date = new Date(entry.dt_txt.split(' ')[0]);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!dailyForecasts[date]) {
            dailyForecasts[date] = true;

            const temperature = Math.round(entry.main.temp - 273.15);
            const windSpeed = entry.wind.speed;
            const humidity = entry.main.humidity;

            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.innerHTML = `
                <h3>${dayOfWeek}</h3>
                <p>Date: ${date.toLocaleDateString()}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Wind: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
            `;
            forecastContainer.appendChild(dayElement);

            // Check if it's today's forecast
            if (date.toDateString() === new Date().toDateString()) {
                const todayDetails = document.createElement('div');
                todayDetails.classList.add('today-details');
                todayDetails.innerHTML = `
                    <p>Date: ${date.toLocaleDateString()}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Wind: ${windSpeed} m/s</p>
                    <p>Humidity: ${humidity}%</p>
                `;
                todayForecastDetails.appendChild(todayDetails);
            }
        }
    });
}

// Function to update the search history
function updateSearchHistory(city) {
    const historyList = document.getElementById('history-list');
    const MAX_HISTORY_ITEMS = 5;

    // Check if the city is already in the search history
    const isCityInHistory = Array.from(historyList.children).some(item => item.textContent === city);

    if (!isCityInHistory) {
        // Create a new list item for the search history
        const listItem = document.createElement('li');
        listItem.textContent = city;

        // Add click event listener to search with the historical city
        listItem.addEventListener('click', () => {
            searchBar.value = city;
            searchWeather();
        });

        // Add the new item to the history list
        historyList.appendChild(listItem);

        // Limit the number of history items displayed
        if (historyList.children.length > MAX_HISTORY_ITEMS) {
            historyList.removeChild(historyList.firstChild);
        }
    }
}

// Function to handle the search button click
function searchWeather() {
    const city = searchBar.value;
    if (city.trim() !== '') {
        getWeather(city)
            .then(data => {
                displayForecast(data);
                updateSearchHistory(city);
            })
            .catch(error => console.error('Error handling:', error.message));
    }
}

// Add click event listener to the search button
searchButton.addEventListener('click', searchWeather);
