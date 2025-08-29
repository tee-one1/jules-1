// script.js

// Define the asynchronous function to fetch weather data
async function getWeatherData() {
  // Istanbul coordinates
  const lat = 41.01;
  const lon = 28.98;
  const apiKey = 'YOUR_API_KEY'; // Placeholder for the API key
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    // Fetch data from the OpenWeatherMap API
    const response = await fetch(url);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const weatherData = await response.json();

    // Update the DOM with the fetched weather data
    document.getElementById('city').textContent = 'Istanbul';
    document.getElementById('temperature').textContent = `${Math.round(weatherData.current.temp)}°C`;
    document.getElementById('description').textContent = weatherData.current.weather[0].description;
  } catch (error) {
    // Log any errors to the console
    console.error('Error fetching weather data:', error);
  }
}

// Call the function to fetch and log the weather data
getWeatherData();
