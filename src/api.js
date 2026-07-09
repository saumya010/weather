const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function searchCities(query, signal) {
  const response = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(query)}&count=5`, { signal });
  if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
  const data = await response.json();
  return data.results ?? [];
}

async function resolveLocation(city, signal) {
  const results = await searchCities(city, signal);
  const location = results[0];
  if (!location) throw new Error(`No results found for "${city}"`);
  return location;
}

export async function fetchWeather(cityOrLocation, signal) {
  const location =
    typeof cityOrLocation === "string" ? await resolveLocation(cityOrLocation, signal) : cityOrLocation;

  const { latitude, longitude, name, country } = location;
  const forecastResponse = await fetch(
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,surface_pressure&forecast_days=5`,
    { signal }
  );
  if (!forecastResponse.ok) throw new Error(`Forecast failed: ${forecastResponse.status}`);
  const forecastData = await forecastResponse.json();

  return {
    id: `${latitude},${longitude}`,
    name,
    country,
    lat: latitude,
    lon: longitude,
    temps: forecastData.hourly.temperature_2m,
    humidity: forecastData.hourly.relative_humidity_2m,
    pressure: forecastData.hourly.surface_pressure,
  };
}
