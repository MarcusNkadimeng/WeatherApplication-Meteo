import { currentWeather } from "./currentWeatherModel";
import { DailyWeather } from "./dailyWeatherModel";
import { convertToCurrentWeather, formatTime } from "./util";
import { Location } from "./locationModel";

export async function getCoordinates(searchQuery: string): Promise<Location[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=10&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error(`Error fetching coordinates: ${response.statusText}`);
    }

    const locationData = await response.json();

    return locationData.results.slice(0, 5).map((result: any) => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPlaceCurrentWeather(
  latitude: number,
  longitude: number
): Promise<currentWeather> {
  try {
    const currentWeatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
    );

    if (!currentWeatherRes.ok) {
      throw new Error(
        `Error fetching weather data: ${currentWeatherRes.statusText}`
      );
    }

    const currentWeatherJSON = await currentWeatherRes.json();
    return convertToCurrentWeather(currentWeatherJSON.current);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPlace7DayForecast(
  latitude: number,
  longitude: number
): Promise<DailyWeather[]> {
  try {
    const dailyWeatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto`
    );

    if (!dailyWeatherRes.ok) {
      throw new Error(
        `Error fetching 7-day weather data: ${dailyWeatherRes.statusText}`
      );
    }

    const dailyWeatherJSON = await dailyWeatherRes.json();

    return dailyWeatherJSON.daily.time.map((date: string, index: number) => ({
      date,
      weather_code: dailyWeatherJSON.daily.weather_code[index],
      temperature_max: dailyWeatherJSON.daily.temperature_2m_max[index],
      temperature_min: dailyWeatherJSON.daily.temperature_2m_min[index],
      sunrise: formatTime(dailyWeatherJSON.daily.sunrise[index]),
      sunset: formatTime(dailyWeatherJSON.daily.sunset[index]),
      precipitation_sum: dailyWeatherJSON.daily.precipitation_sum[index],
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLiveLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          resolve({ lat, lng });
        },
        (error) => {
          console.error("Error getting user location:", error);
          reject(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    const address = data.address;
    const placeName =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.suburb ||
      `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    return placeName;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
  }
}

export async function getLiveLocationReverseGeocode(): Promise<string> {
  const { lat, lng } = await getLiveLocation();
  return await reverseGeocode(lat, lng);
}
