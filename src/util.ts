import { currentWeather } from "./currentWeatherModel";

export function getWeatherDescription(weatherCode: number): string {
  switch (weatherCode) {
    case 0:
      return "Clear skies";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
      return "Fog";
    case 48:
      return "Depositing rime fog";
    case 51:
      return "Drizzle: Light";
    case 53:
      return "Drizzle: Moderate";
    case 55:
      return "Drizzle: Dense intensity";
    case 56:
      return "Freezing Drizzle: Light";
    case 57:
      return "Freezing Drizzle: Dense intensity";
    case 61:
      return "Rain: Slight";
    case 63:
      return "Rain: Moderate";
    case 65:
      return "Rain: Heavy intensity";
    case 66:
      return "Freezing Rain: Light";
    case 67:
      return "Freezing Rain: Heavy intensity";
    case 71:
      return "Snow fall: Slight";
    case 73:
      return "Snow fall: Moderate";
    case 75:
      return "Snow fall: Heavy intensity";
    case 77:
      return "Snow grains";
    case 80:
      return "Rain showers: Slight";
    case 81:
      return "Rain showers: Moderate";
    case 82:
      return "Rain showers: Violent";
    case 85:
      return "Snow showers slight";
    case 86:
      return "Snow showers heavy";
    case 95:
      return "Thunderstorm: Slight/moderate";
    case 96:
      return "Thunderstorm with slight hail";
    case 99:
      return "Thunderstorm with heavy hail";
    default:
      return "Unknown weather code";
  }
}

export function getWeatherIcon(weatherCode: number): string {
  switch (weatherCode) {
    case 0:
      return "assets/sun.png";
    case 1:
      return "assets/mainly-clear.png";
    case 2:
      return "assets/partly-cloudy.png";
    case 3:
      return "assets/overcast.png";
    case 45:
    case 48:
      return "assets/fog.png";
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return "assets/drizzle.png";
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return "assets/rain-showers.png";
    case 71:
    case 73:
    case 75:
    case 77:
      return "assets/snow.png";
    case 80:
    case 81:
    case 82:
      return "assets/rain-showers.png";
    case 85:
    case 86:
      return "assets/snow-shower.png";
    case 95:
    case 96:
    case 99:
      return "assets/thunderstorm.png";
    default:
      return "assets/partly-cloudy.png";
  }
}

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
