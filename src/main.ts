import { get7DayForecast, getCurrentWeather } from "./api";
import { update7DayForecast, updateWeather } from "./dom";

async function init() {
  try {
    const currentWeather = await getCurrentWeather();
    console.log(currentWeather);
    updateWeather(currentWeather);

    const forecast = await get7DayForecast();
    console.log(forecast);
    update7DayForecast(forecast);
  } catch (error) {
    console.error("Error initializing weather data:", error);
  }
}

document.addEventListener("DOMContentLoaded", init);
