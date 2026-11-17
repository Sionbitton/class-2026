import {useEffect,useState} from 'react';
import Weather from './Weather.jsx';
const zip = '08701';
export default function App() {
    const [weather,setWeather] = useState(null);
    const [error,setError] = useState('');
    useEffect(() => {
        const controller = new AbortController();
        async function loadWeather() {
            try {
                const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
                if (!key) throw new Error('Set VITE_OPENWEATHER_API_KEY in your local .env file, then restart Vite.');
                const params = new URLSearchParams({zip:zip+',us',units:'imperial',appid:key});
                const response = await fetch('https://api.openweathermap.org/data/2.5/weather?'+params,{signal:controller.signal});
                if (!response.ok) throw new Error('Weather request failed ('+response.status+'). Check your key and connection.');
                const data = await response.json();
                if (!data.main || !Array.isArray(data.weather) || !data.weather.length) throw new Error('Weather service returned incomplete data.');
                if (!controller.signal.aborted) setWeather(data);
            } catch(error) { if (!controller.signal.aborted) setError(error.message); }
        }
        loadWeather();
        return () => controller.abort();
    },[]);
    return <main><h1>Local Weather</h1><p>ZIP code: {zip}</p>{error ? <p role="alert">{error}</p> : weather ? <Weather weather={weather}/> : <p role="status">Loading weather…</p>}</main>;
}
