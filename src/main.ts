import {
  getLiveLocationReverseGeocode,
  getPlace7DayForecast,
  getPlaceCurrentWeather,
} from "./api";
import {
  displayMyPlaces,
  handleSearch,
  update7DayForecast,
  updateWeather,
} from "./dom";
import { fetchLiveLocationDetails } from "./liveLocationUtil";

async function init() {
  try {
    const defaultLocation = JSON.parse(
      localStorage.getItem("defaultLocation") || "null"
    );
    if (defaultLocation) {
      // Fetch weather details for the default location
      const weatherData = await getPlaceCurrentWeather(
        defaultLocation.latitude,
        defaultLocation.longitude
      );
      const dailyWeather = await getPlace7DayForecast(
        defaultLocation.latitude,
        defaultLocation.longitude
      );
      const defaultPlaceLabel = document.querySelector(".defaultPlace-label");
      if (defaultPlaceLabel) {
        defaultPlaceLabel.textContent = defaultLocation.name;
      }
      updateWeather(
        weatherData,
        dailyWeather[0],
        getLiveLocationReverseGeocode
      );
      update7DayForecast(dailyWeather);
    } else {
      fetchLiveLocationDetails();
    }

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
