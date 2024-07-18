import L from "leaflet";
import { getPlaceCurrentWeather } from "./api";
import { currentWeather } from "./currentWeatherModel";
import { showModal } from "./dom";
import { Location } from "./location";

var map = L.map("map").setView([-25.786, 28.281], 13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(map);

map.on("click", async (event) => {
  const { lat, lng } = event.latlng;

  const placeName = await reverseGeocode(lat, lng);

  const weatherData: currentWeather = await getPlaceCurrentWeather(lat, lng);
  const location: Location = {
    name: placeName,
    latitude: lat,
    longitude: lng,
    country: "",
  };
  showModal(location, weatherData);
  console.log(location, weatherData);
});

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

export function addMarker(location: Location) {
  L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(location.name);
}
