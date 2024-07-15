import { currentWeather } from "./currentWeatherModel";
import { DailyWeather } from "./dailyWeatherModel";
import { convertToCurrentWeather, formatTime } from "./util";

export async function getCurrentWeather(): Promise<currentWeather> {
  try {
    const currentWeatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-25.444150&longitude=28.280809&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto"
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

export async function get7DayForecast(): Promise<DailyWeather[]> {
  try {
    const dailyWeatherRes = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-25.7857014&longitude=28.280809&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&timezone=auto"
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
