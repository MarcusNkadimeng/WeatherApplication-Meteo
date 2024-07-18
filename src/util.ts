import { currentWeather } from "./currentWeatherModel";

export function convertToCurrentWeather(data: any): currentWeather {
  return {
    time: data.time,
    interval: data.interval,
    temperature_2m: data.temperature_2m,
    apparent_temperature: data.apparent_temperature,
    weather_code: data.weather_code,
    wind_speed_10m: data.wind_speed_10m,
    wind_direction_10m: data.wind_direction_10m,
  };
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function convertDirection(degrees: number): string {
  if (degrees === 0 || degrees === 360) {
    return "North";
  } else if (degrees > 0 && degrees < 90) {
    return "North east";
  } else if (degrees === 90) {
    return "East";
  } else if (degrees > 90 && degrees < 180) {
    return "South east";
  } else if (degrees === 180) {
    return "South";
  } else if (degrees > 180 && degrees < 270) {
    return "South west";
  } else if (degrees === 270) {
    return "West";
  } else if (degrees > 270 && degrees < 360) {
    return "North west";
  } else {
    return "";
  }
}
