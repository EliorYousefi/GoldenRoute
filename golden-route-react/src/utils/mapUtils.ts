export async function initMap(centerLat: number, centerLon: number): Promise<void> {
  new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: centerLat, lng: centerLon },
    zoom: 10
  });
}
