import L from "leaflet";
import { getPlaceCurrentWeather, reverseGeocode } from "./api";
import { currentWeather } from "./currentWeatherModel";
import { showModal } from "./dom";
import { Location } from "./locationModel";

const map = L.map("map").setView([-25.786, 28.281], 13);
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

export function addMarker(location: Location) {
  L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(location.name);
}
export { reverseGeocode };
