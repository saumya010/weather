import Chart from "./Chart.jsx";
import Map from "./Map.jsx";

const WeatherList = ({ weather, onRemove }) => {
  if (weather.length === 0) {
    return <p className="empty-state">Search for a city to see its forecast.</p>;
  }

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>City</th>
          <th>Map</th>
          <th>Temperature (°C)</th>
          <th>Pressure (hPa)</th>
          <th>Humidity (%)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {weather.map((city) => (
          <tr key={city.id}>
            <td>
              {city.name}
              {city.country ? `, ${city.country}` : ""}
            </td>
            <td>
              <Map lat={city.lat} lon={city.lon} name={city.name} />
            </td>
            <td>
              <Chart data={city.temps} color="orange" units="°C" />
            </td>
            <td>
              <Chart data={city.pressure} color="green" units="hPa" />
            </td>
            <td>
              <Chart data={city.humidity} color="blue" units="%" />
            </td>
            <td>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onRemove(city.id)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WeatherList;
