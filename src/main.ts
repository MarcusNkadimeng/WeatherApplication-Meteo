import { get7DayForecast, getCurrentWeather } from "./api";
import {
  displayMyPlaces,
  handleSearch,
  update7DayForecast,
  updateWeather,
} from "./dom";

async function init() {
  try {
    const currentWeather = await getCurrentWeather();
    console.log(currentWeather);

    const forecast = await get7DayForecast();
    console.log(forecast);
    updateWeather(currentWeather, forecast[0]);
    update7DayForecast(forecast);

    const searchForm = document.querySelector("form");
    if (searchForm) {
      searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSearch();
      });
    }
  } catch (error) {
    console.error("Error initializing weather data:", error);
  }

  displayMyPlaces();
}

document.addEventListener("DOMContentLoaded", init);
