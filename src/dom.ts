import { currentWeather } from "./currentWeatherModel";
import { DailyWeather } from "./dailyWeatherModel";

function getWeatherDescription(weatherCode: number): string {
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

function getWeatherIcon(weatherCode: number): string {
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

export function updateWeatherDescription(weatherCode: number): void {
  const description = getWeatherDescription(weatherCode);
  const weatherDescriptionElement = document.querySelector(
    ".weather-description"
  );
  if (weatherDescriptionElement) {
    weatherDescriptionElement.textContent = description;
  }
}

export function updateWeatherIcon(weatherCode: number): void {
  const iconFileName = getWeatherIcon(weatherCode);
  const weatherIconElement = document.querySelector(".weather-icon");
  if (weatherIconElement) {
    weatherIconElement.setAttribute("src", iconFileName);
    weatherIconElement.setAttribute("alt", getWeatherDescription(weatherCode));
  } else {
    console.error("No element found with class .weather-icon");
  }
}

export function updateCurrentTemperature(temp: number) {
  const tempElement = document.querySelector(".current-temperature");
  if (tempElement) {
    tempElement.textContent = `${temp}˚`;
  }
}

export function updateApparentTemperature(temp: number): void {
  const apparentTempElement = document.querySelector(".apparent-temperature");
  if (apparentTempElement) {
    apparentTempElement.textContent = `${temp}˚`;
  }
}

export function updateSunriseTime(time: string) {
  const sunriseElement = document.querySelector(".sunrise-time");
  if (sunriseElement) {
    sunriseElement.textContent = `${time}`;
  }
}

export function updateSunsetTime(time: string) {
  const sunsetElement = document.querySelector(".sunset-time");
  if (sunsetElement) {
    sunsetElement.textContent = `${time}`;
  }
}

// MARK: - Current weather update function
export function updateWeather(
  currentWeather: currentWeather,
  todayWeather: DailyWeather
) {
  updateCurrentTemperature(currentWeather.temperature_2m);
  updateWeatherDescription(currentWeather.weather_code);
  updateApparentTemperature(currentWeather.apparent_temperature);
  updateWeatherIcon(currentWeather.weather_code);
  updateSunriseTime(todayWeather.sunrise);
  updateSunsetTime(todayWeather.sunset);
}

// MARK: - 7-day weather forecast
export function update7DayForecast(forecast: DailyWeather[]) {
  const forecastContainer = document.querySelector(
    ".seven-day-forecast .forecast-container"
  );
  if (!forecastContainer) return;

  forecastContainer.innerHTML = "";

  forecast.forEach((day) => {
    const forecastDayDiv = document.createElement("div");
    forecastDayDiv.classList.add(
      "forecast-day",
      "flex",
      "flex-col",
      "justify-between",
      "bg-gray-200",
      "p-4",
      "rounded-lg",
      "border",
      "border-cardItemBorder",
      "shadow-lg",
      "shadow-cyan-500/50"
    );

    const dayNameDiv = document.createElement("div");
    dayNameDiv.classList.add("day", "text-black");
    dayNameDiv.textContent = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const divider = document.createElement("hr");
    divider.classList.add(
      "section-divider",
      "h-0.5",
      "m-0.5",
      "bg-black",
      "border-0"
    );

    const temperatureDiv = document.createElement("div");
    temperatureDiv.classList.add(
      "temperature",
      "text-black",
      "justify-center",
      "self-center"
    );
    temperatureDiv.textContent = `${day.temperature_max}˚ / ${day.temperature_min}˚`;

    const weatherCodeDiv = document.createElement("div");
    weatherCodeDiv.classList.add(
      "weather-code",
      "text-black",
      "justify-center",
      "self-center"
    );
    weatherCodeDiv.textContent = getWeatherDescription(day.weather_code);

    const weatherIconImg = document.createElement("img");
    weatherIconImg.classList.add(
      "weather-icon",
      "w-8",
      "h-8",
      "justify-center",
      "self-center"
    );
    weatherIconImg.src = getWeatherIcon(day.weather_code);
    weatherIconImg.alt = getWeatherDescription(day.weather_code);

    const precipitation_symbol = document.createElement("img");
    precipitation_symbol.setAttribute("src", "assets/precipitation.png");
    precipitation_symbol.setAttribute("alt", "Precipitation symbol");

    const precipitationDiv = document.createElement("div");
    precipitationDiv.classList.add(
      "flex",
      "flex-row",
      "precipitation-sum",
      "text-black",
      "justify-center",
      "self-center"
    );

    const precipitationImg = document.createElement("img");
    precipitationImg.src = "assets/precipitation.png"; // Path to your precipitation image
    precipitationImg.alt = "Precipitation";
    precipitationImg.classList.add("w-8", "h-8", "mr-2");

    const precipitationText = document.createElement("span");
    precipitationText.textContent = `${day.precipitation_sum}mm`;

    precipitationDiv.appendChild(precipitationImg);
    precipitationDiv.appendChild(precipitationText);

    forecastDayDiv.appendChild(dayNameDiv);
    forecastDayDiv.appendChild(divider);
    forecastDayDiv.appendChild(temperatureDiv);
    forecastDayDiv.appendChild(weatherCodeDiv);
    forecastDayDiv.appendChild(weatherIconImg);
    forecastDayDiv.appendChild(precipitationDiv);

    forecastContainer.appendChild(forecastDayDiv);
  });
}
