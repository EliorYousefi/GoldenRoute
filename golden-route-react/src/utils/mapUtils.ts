export async function initMap(centerLat: number, centerLon: number, radius: number): Promise<void> {
  const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: { lat: centerLat, lng: centerLon },
    zoom: 10
  });
}
