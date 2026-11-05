export const ROCHESTER = { latitude: 43.1566, longitude: -77.6088, label: "Rochester, NY" };

export function coconutCondition(code, wind = 0) {
    if ([95, 96, 99].includes(code)) return { state: "storm", label: "Thunderstorms", sign: "Coconut is sheltering", symbol: "⛈" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { state: "snow", label: "Snow", sign: "Coconut is snowy", symbol: "❄" };
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { state: "rain", label: "Rain or drizzle", sign: "Coconut is wet", symbol: "🌧" };
    if ([45, 48].includes(code)) return { state: "fog", label: "Fog", sign: "Coconut is hard to see", symbol: "🌫" };
    if (![0, 1, 2, 3].includes(code)) return { state: "default", label: "Unknown conditions", sign: "Coconut is on standby", symbol: "" };
    if (wind >= 20) return { state: "wind", label: "Windy", sign: "Coconut is swaying", symbol: "💨" };
    if ([1, 2, 3].includes(code)) return { state: "cloudy", label: "Cloudy", sign: "Coconut is under the clouds", symbol: "☁" };
    return { state: "sunny", label: "Clear skies", sign: "Coconut is dry", symbol: "" };
}

export async function fetchWeather({ latitude, longitude }, signal) {
    const params = new URLSearchParams({
        latitude, longitude,
        current: "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,is_day",
        temperature_unit: "fahrenheit", wind_speed_unit: "mph", precipitation_unit: "inch", timezone: "auto",
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    if (!current || !["temperature_2m", "apparent_temperature", "precipitation", "weather_code", "wind_speed_10m", "is_day"].every((key) => Number.isFinite(current[key]))) {
        throw new Error("Weather data is incomplete");
    }
    return current;
}
