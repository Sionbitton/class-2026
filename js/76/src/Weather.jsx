export default function Weather({weather}) {
    return <section aria-label="Current weather"><h2>{weather.name}</h2><p>{weather.weather[0].description}</p><p>Temperature: {Math.round(weather.main.temp)}°F</p><p>Feels like: {Math.round(weather.main.feels_like)}°F</p><p>Humidity: {weather.main.humidity}%</p>{weather.wind && <p>Wind: {weather.wind.speed} mph</p>}</section>;
}
