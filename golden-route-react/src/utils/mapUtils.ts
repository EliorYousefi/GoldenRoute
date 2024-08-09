// import { fetchAndFilterFlights } from '../services/flightService';

export async function initMap(centerLat: number, centerLon: number, radius: number): Promise<void> {
  const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: centerLat, lng: centerLon },
    zoom: 10
  });

  // const flights = await fetchAndFilterFlights(centerLat, centerLon, radius);
  
  // flights.forEach(flight => {
  //   new google.maps.Marker({
  //     position: { lat: flight.latitude, lng: flight.longitude },
  //     map: map,
  //     title: flight.callsign
  //   });
  // });
}
