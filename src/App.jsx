import "./App.css";
import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function getWeather() {
    if (city.trim() === "") {
      setError("Please enter a city.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const API_KEY = import.meta.env.VITE_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
      );

      const data = await response.json();

      if (data.cod !== 200) {
        if (data.cod === "404") {
          setError("City not found.");
        } else {
          setError(data.message);
        }
        setWeather(null);
      } else {
        setWeather(data);
        setSearchedCity(city);
        setCity("");
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  }
  return (
    <div className="container">
      <div className="weather-card">
        <h1>Weather App</h1>

        <div className="search-box">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            type="text"
            placeholder="Enter city"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />
        </div>
        <button onClick={getWeather}>Search City</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {weather && (
          <div className="weather-info">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <h1 className="temp">{Math.round(weather.main.temp)}°C</h1>

            <div className="details">
              <p>Feels Like: {Math.round(weather.main.feels_like)}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Condition: {weather.weather[0].description}</p>
              <p>Wind: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
