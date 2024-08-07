import {
  getCoordinates,
  getLiveLocationReverseGeocode,
  getPlace7DayForecast,
  getPlaceCurrentWeather,
} from "./api";
import { currentWeather } from "./currentWeatherModel";
import { DailyWeather } from "./dailyWeatherModel";
import { Location } from "./locationModel";
import { addMarker } from "./openstreetmap";
import {
  convertDirection,
  getWeatherDescription,
  getWeatherIcon,
} from "./util";

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

export async function updateLocationName(callback: () => Promise<string>) {
  const locationLabel = document.querySelector(".defaultPlace-label");
  if (locationLabel) {
    const defaultLocation = JSON.parse(
      localStorage.getItem("defaultLocation") || "{}"
    );
    if (Object.keys(defaultLocation).length !== 0) {
      locationLabel.textContent = defaultLocation.name;
    } else {
      locationLabel.textContent = await callback();
    }
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
  todayWeather: DailyWeather,
  liveLocationGeocode: () => Promise<string>
) {
  const defaultLocation = JSON.parse(
    localStorage.getItem("defaultLocation") || "{}"
  );
  if (Object.keys(defaultLocation).length === 0) {
    updateLocationName(liveLocationGeocode);
  }
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
      "p-2",
      "rounded-lg",
      "border",
      "border-cardItemBorder",
      "shadow-lg",
      "shadow-cyan-500/50",
      "w-2/5"
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

export async function handleSearch() {
  const searchInput = (
    document.getElementById("search-bar") as HTMLInputElement
  ).value;

  try {
    const locations: Location[] = await getCoordinates(searchInput);
    displaySearchResults(locations);
  } catch (error) {
    console.error("Error handling search:", error);
  }
}

export function displaySearchResults(locations: Location[]) {
  const resultsContainer = document.getElementById("results-container");
  if (!resultsContainer) return;

  resultsContainer.innerHTML = "";

  locations.forEach((location) => {
    const resultItem = document.createElement("div");
    resultItem.className =
      "flex result-item text-xl h-10 cursor-pointer self-center p-2";
    resultItem.textContent = `${location.name}, ${location.country}`;

    const divider = document.createElement("hr");
    divider.classList.add(
      "section-divider",
      "h-0.5",
      "m-0.5",
      "bg-gray-500",
      "border-0"
    );

    resultItem.addEventListener("click", async () => {
      try {
        const weatherData: currentWeather = await getPlaceCurrentWeather(
          location.latitude,
          location.longitude
        );
        showModal(location, weatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    });

    resultsContainer.appendChild(resultItem);
    resultsContainer.appendChild(divider);
  });

  const clearBtn = document.getElementById("clear-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearSearch);
  }
}

function clearSearch() {
  const searchBar = document.getElementById("search-bar") as HTMLInputElement;
  const resultsContainer = document.getElementById("results-container");

  if (searchBar) {
    searchBar.value = "";
  }

  if (resultsContainer) {
    resultsContainer.innerHTML = "";
  }
}

export function showModal(location: Location, weatherData: currentWeather) {
  const modal = document.getElementById("weather-modal");
  if (!modal) return;

  document.body.classList.add("modal-open");
  modal.style.display = "flex";

  const modalContent = document.getElementById("modal-weather-details");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <h2 class="text-3xl">${location.name}</h2>
    <p>Temperature: ${weatherData.temperature_2m}˚C</p>
    <p>${getWeatherDescription(weatherData.weather_code)}</p>
    <img src="${getWeatherIcon(
      weatherData.weather_code
    )}" alt="${getWeatherDescription(
    weatherData.weather_code
  )}" class="w-8 h-8"/>
    <div class="flex flex-row">
      <img src="assets/wind.png" alt="Wind conditions" class="w-8 h-8"
      />
      <p>${weatherData.wind_speed_10m}km/h, ${convertDirection(
    weatherData.wind_direction_10m
  )}</p>
    </div>
  `;

  const addToPlacesBtn = document.getElementById("add-to-places");
  if (addToPlacesBtn) {
    addToPlacesBtn.onclick = () => {
      addToPlaces(location);
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };
    addToPlacesBtn.addEventListener("click", clearSearch);
  }

  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };
    closeModalBtn.addEventListener("click", clearSearch);
  }
}

function addToPlaces(location: Location) {
  const places = JSON.parse(localStorage.getItem("places") || "[]");
  console.log(places);
  places.push(location);
  localStorage.setItem("places", JSON.stringify(places));
  displayMyPlaces();
  addMarker(location);
}

// MARK: - My Places weather details
export function displayMyPlaces() {
  const places: Location[] = JSON.parse(localStorage.getItem("places") || "[]");
  const placesContainer = document.querySelector(".places-container");
  if (!placesContainer) return;

  placesContainer.innerHTML = "";

  places.forEach(async (place: Location) => {
    try {
      const weatherData: currentWeather = await getPlaceCurrentWeather(
        place.latitude,
        place.longitude
      );
      const placeDiv = document.createElement("div");
      placeDiv.classList.add(
        "place-card",
        "flex",
        "flex-col",
        "justify-between",
        "bg-gray-200",
        "p-4",
        "rounded-lg",
        "justify-between",
        "border",
        "border-cardItemBorder",
        "shadow-lg",
        "shadow-cyan-500/50",
        "items-center",
        "w-48"
      );

      const cityNameDiv = document.createElement("div");
      cityNameDiv.classList.add("city", "text-black", "text-lg");
      cityNameDiv.textContent = place.name;

      const temperatureDiv = document.createElement("div");
      temperatureDiv.classList.add("temperature", "text-black", "text-sm");
      temperatureDiv.textContent = `${weatherData.temperature_2m}˚C`;

      const weatherIcon = document.createElement("img");
      weatherIcon.classList.add(
        "weather-icon",
        "w-8",
        "h-8",
        "justify-center",
        "self-center"
      );
      weatherIcon.src = getWeatherIcon(weatherData.weather_code);
      weatherIcon.alt = getWeatherDescription(weatherData.weather_code);

      placeDiv.addEventListener("click", () => {
        showLocationDetailsModal(place, weatherData);
      });

      placeDiv.appendChild(cityNameDiv);
      placeDiv.appendChild(temperatureDiv);
      placeDiv.appendChild(weatherIcon);

      placesContainer.appendChild(placeDiv);
    } catch (error) {
      console.error(`Error fetching weather data for ${place.name}:`, error);
    }
  });
}

function showLocationDetailsModal(
  location: Location,
  weatherData: currentWeather
) {
  const modal = document.getElementById("places-weather-modal");
  if (!modal) return;

  document.body.classList.add("modal-open");
  modal.style.display = "flex";

  const modalContent = document.getElementById("place-modal-weather-details");
  if (!modalContent) return;

  modalContent.innerHTML = `
    <h2 class="text-3xl">${location.name}</h2>
    <p>Temperature: ${weatherData.temperature_2m}˚C</p>
    <p>${getWeatherDescription(weatherData.weather_code)}</p>
    <img src="${getWeatherIcon(
      weatherData.weather_code
    )}" alt="${getWeatherDescription(
    weatherData.weather_code
  )}" class="w-8 h-8"/>
    <div class="flex flex-row">
    <img src="assets/wind.png" alt="Wind conditions" class="w-8 h-8"
    />
    <p>${weatherData.wind_speed_10m}km/h, ${convertDirection(
    weatherData.wind_direction_10m
  )}</p>
    </div>
  `;

  const makeDefaultBtn = document.getElementById("make-default-btn");
  if (makeDefaultBtn) {
    makeDefaultBtn.onclick = async () => {
      localStorage.setItem("defaultLocation", JSON.stringify(location));
      try {
        const defaultWeather = await getPlaceCurrentWeather(
          location.latitude,
          location.longitude
        );
        const defaultDailyWeather = await getPlace7DayForecast(
          location.latitude,
          location.longitude
        );
        const defaultPlaceLabel = document.querySelector(".defaultPlace-label");
        if (defaultPlaceLabel) {
          defaultPlaceLabel.textContent = location.name;
        }

        updateWeather(
          defaultWeather,
          defaultDailyWeather[0],
          getLiveLocationReverseGeocode
        );
        update7DayForecast(defaultDailyWeather);
        console.log("Current weather for: ", location, defaultWeather);
        console.log("7 day forecast for: ", location, defaultDailyWeather[0]);
      } catch (error) {
        console.error("Error fetching default location weather data:", error);
      }
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
    };
  }

  const closeModalBtn = document.getElementById("close-modal-btn-two");
  if (closeModalBtn) {
    closeModalBtn.onclick = () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-open-two");
    };
  }
}
