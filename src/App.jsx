import { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import WeatherList from "./components/WeatherList.jsx";
import { fetchWeather } from "./api.js";

const App = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeather(city);
      setWeather((prev) => [result, ...prev.filter((w) => w.id !== result.id)]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    setWeather((prev) => prev.filter((w) => w.id !== id));
  };

  return (
    <div className="container">
      <h1>Weather Forecast</h1>
      <p className="subtitle">Search a city for its 5-day temperature, pressure, and humidity trends</p>
      <SearchBar onSearch={handleSearch} loading={loading} />
      {error && <p className="alert alert-danger">{error}</p>}
      <WeatherList weather={weather} onRemove={handleRemove} />

      <footer className="footer">
        <p>
          Weather data by{" "}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{" "}
          &middot; Maps by{" "}
          <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer">
            OpenStreetMap
          </a>
        </p>
        <p>
          Built by{" "}
          <a href="https://iamsaumya.com" target="_blank" rel="noreferrer">
            Saumya
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
