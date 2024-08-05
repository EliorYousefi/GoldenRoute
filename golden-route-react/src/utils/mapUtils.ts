import { fetchFlights } from '../services/flightService';
import { haversineDistance } from './distanceUtil';

interface Flight {
    latitude: number;
    longitude: number;
    callsign: string;
}

export async function initMap(centerLat: number, centerLon: number, radius: number): Promise<void> {
    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: centerLat, lng: centerLon },
        zoom: 10
    });

    const flights = await getFlightsWithinRadius(centerLat, centerLon, radius);
    flights.forEach(flight => {
        new google.maps.Marker({
            position: { lat: flight.latitude, lng: flight.longitude },
            map: map,
            title: flight.callsign
        });
    });
}

async function getFlightsWithinRadius(centerLat: number, centerLon: number, radius: number): Promise<Flight[]> {
    const flights = await fetchFlights();
    return flights.filter(flight => {
        const distance = haversineDistance(centerLat, centerLon, flight.latitude, flight.longitude);
        return distance <= radius;
    });
}
