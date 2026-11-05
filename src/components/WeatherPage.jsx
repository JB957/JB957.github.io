import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { coconutCondition, fetchWeather, ROCHESTER } from "../utils/weather";
import "./WeatherPage.css";

export default function WeatherPage() {
    const [place, setPlace] = useState(ROCHESTER);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locating, setLocating] = useState(false);
    const [notice, setNotice] = useState("");
    const [error, setError] = useState("");
    const [refresh, setRefresh] = useState(0);
    const locationRequest = useRef(0);

    useEffect(() => () => { locationRequest.current += 1; }, []);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;
        const timeout = setTimeout(() => controller.abort(), 15000);
        setLoading(true);
        setWeather(null);
        setError("");
        fetchWeather(place, controller.signal)
            .then((current) => { if (active) setWeather(current); })
            .catch(() => { if (active) setError("Couldn't load the weather. Please try again."); })
            .finally(() => { clearTimeout(timeout); if (active) setLoading(false); });
        return () => { active = false; clearTimeout(timeout); controller.abort(); };
    }, [place, refresh]);

    const useLocation = () => {
        const request = ++locationRequest.current;
        const fallback = (message) => {
            if (request !== locationRequest.current) return;
            setLocating(false);
            setNotice(`${message} Showing Rochester weather instead.`);
            setPlace({ ...ROCHESTER });
        };
        if (!navigator.geolocation) return fallback("Location isn't supported by this browser.");
        setLocating(true);
        setNotice("");
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                if (request !== locationRequest.current) return;
                setLocating(false);
                setPlace({ latitude: coords.latitude, longitude: coords.longitude, label: "Your location" });
            },
            (failure) => fallback(failure.code === 1 ? "Location permission was denied." : "Couldn't determine your location."),
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
        );
    };

    const condition = coconutCondition(weather?.weather_code, weather?.wind_speed_10m);
    const symbol = condition.state === "sunny" ? (weather.is_day ? "☀" : "☾") : condition.symbol;

    return (
        <main className="coconut-weather">
            <div className="weather-card">
                <Link className="weather-back" to="/main-menu">‹ Back to menu</Link>
                <header><p className="weather-eyebrow">A LITTLE ISLAND FORECAST</p><h1>Coconut weather</h1><p>The coconut has a report for you.</p></header>
                <div className={`coconut-scene coconut-${condition.state}`} role="img" aria-label={weather ? condition.sign : "Coconut waiting for a weather report"}>
                    <span className="weather-symbol" aria-hidden="true">{symbol}</span>
                    <div className="coconut-rope" /><div className="weather-coconut"><i /><i /><i /></div>
                    <div className="coconut-sand" />
                </div>
                <div className="coconut-sign">{loading ? "Checking on the coconut…" : condition.sign}</div>
                <section className="weather-report" aria-live="polite" aria-busy={loading || locating}>
                    <h2>{place.label}</h2>
                    {locating && <p>Waiting for your location…</p>}
                    {notice && <p>{notice}</p>}
                    {loading && <p>Loading current weather…</p>}
                    {error && <p role="alert">{error}</p>}
                    {weather && <>
                        <p className="weather-temperature">{Math.round(weather.temperature_2m)}°F</p><p>{condition.label}</p>
                        <dl className="weather-details">
                            <div><dt>Feels like</dt><dd>{Math.round(weather.apparent_temperature)}°F</dd></div>
                            <div><dt>Wind</dt><dd>{Math.round(weather.wind_speed_10m)} mph</dd></div>
                            <div><dt>Precipitation</dt><dd>{weather.precipitation.toFixed(2)} in</dd></div>
                        </dl>
                    </>}
                </section>
                <div className="weather-actions">
                    <button type="button" onClick={useLocation} disabled={locating}>{locating ? "Finding you…" : "Use my location"}</button>
                    <button type="button" onClick={() => setRefresh((value) => value + 1)} disabled={loading || locating}>Refresh weather</button>
                </div>
                <p className="weather-privacy">Use your location for a local forecast. Coordinates are sent directly to Open-Meteo and aren’t saved by this site.</p>
                <footer>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a></footer>
            </div>
        </main>
    );
}
