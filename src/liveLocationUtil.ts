import {
  getLiveLocation,
  getLiveLocationReverseGeocode,
  getPlace7DayForecast,
  getPlaceCurrentWeather,
} from "./api";
import { update7DayForecast, updateWeather } from "./dom";

export async function fetchLiveLocationDetails() {
  try {
    const { lat, lng } = await getLiveLocation();

    const currentWeather = await getPlaceCurrentWeather(lat, lng);
    console.log(currentWeather);

    const forecast = await getPlace7DayForecast(lat, lng);

    updateWeather(currentWeather, forecast[0], getLiveLocationReverseGeocode);
    update7DayForecast(forecast);
  } catch (error) {
    console.error("Error fetching live location details:", error);
  }
}
