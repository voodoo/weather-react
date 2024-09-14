const apiKey = 'aa99dfb19a9395b706b810b7a05ce071'; // Replace with your OpenWeatherMap API key

function setTheme(weatherCondition) {
    const body = document.body;
    const container = document.querySelector('.container');
    
    switch(weatherCondition) {
        case 'Clear':
            body.style.background = 'linear-gradient(135deg, #87CEEB, #E0F6FF)';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            break;
        case 'Clouds':
            body.style.background = 'linear-gradient(135deg, #B0C4DE, #D3D3D3)';
            container.style.backgroundColor = 'rgba(245, 245, 245, 0.8)';
            break;
        case 'Rain':
        case 'Drizzle':
            body.style.background = 'linear-gradient(135deg, #4682B4, #708090)';
            container.style.backgroundColor = 'rgba(240, 248, 255, 0.8)';
            break;
        case 'Thunderstorm':
            body.style.background = 'linear-gradient(135deg, #2F4F4F, #483D8B)';
            container.style.backgroundColor = 'rgba(220, 220, 220, 0.8)';
            break;
        case 'Snow':
            body.style.background = 'linear-gradient(135deg, #E6E6FA, #F0F8FF)';
            container.style.backgroundColor = 'rgba(255, 250, 250, 0.8)';
            break;
        default:
            body.style.background = 'linear-gradient(135deg, #83a4d4, #b6fbff)';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
}

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const weatherInfo = document.getElementById('weatherInfo');
    
    let city = cityInput.value.trim();

    if (!city) {
        weatherInfo.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }

    weatherInfo.innerHTML = '<p>Loading...</p>'; // Show loading message
    weatherInfo.classList.remove('show');

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`);
        const data = await response.json();
        if (response.ok) {
            const weather = data.weather[0].description;
            const temp = Math.round(data.main.temp);
            const humidity = data.main.humidity;
            const iconCode = data.weather[0].icon;
            const mainWeather = data.weather[0].main;

            const cityWeather = document.createElement('div');
            cityWeather.className = 'city-weather';
            cityWeather.innerHTML = `
                <h2>Weather in ${city}</h2>
                <img src="http://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather icon">
                <p><i class="fas fa-thermometer-half"></i> Temperature: ${temp}°F</p>
                <p><i class="fas fa-cloud"></i> Weather: ${weather}</p>
                <p><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
            `;

            weatherInfo.innerHTML = ''; // Clear loading message
            weatherInfo.appendChild(cityWeather);

            // Set the theme based on the weather
            setTheme(mainWeather);

            // Use requestAnimationFrame to ensure the DOM has updated
            requestAnimationFrame(() => {
                // Trigger the animation
                weatherInfo.classList.add('show');
            });
        } else {
            weatherInfo.innerHTML = `<p class="error"><i class="fas fa-exclamation-circle"></i> Error for ${city}: ${data.message}</p>`;
            weatherInfo.classList.add('show');
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p class="error"><i class="fas fa-exclamation-circle"></i> An error occurred for ${city}. Please try again.</p>`;
        weatherInfo.classList.add('show');
        console.error('Error:', error);
    }

    // Clear input after search
    cityInput.value = '';
}

// Load weather for default city on page load
window.onload = () => {
    const cityInput = document.getElementById('cityInput');
    cityInput.value = 'London'; // Set default city to London
    getWeather();
};