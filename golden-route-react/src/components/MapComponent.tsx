import React, { useState, useEffect } from 'react';

interface MapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }, radius: number, speed: number) => void;
  radius: number;
  speed: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ onLocationSelect, radius, speed }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocationSet, setUserLocationSet] = useState(false);
  const [lastClickLocation, setLastClickLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  useEffect(() => {
    if (window.google) {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const defaultCenter = lastClickLocation || { lat: 0, lng: 0 };
        const initialMap = new google.maps.Map(mapElement, {
          center: defaultCenter,
          zoom: 12,
        });

        setMap(initialMap);

        const handleMapClick = (event: google.maps.MapMouseEvent) => {
          const latLng = event.latLng;
          if (latLng) {
            const location = {
              lat: latLng.lat(),
              lng: latLng.lng(),
            };
            onLocationSelect(location, radius, speed);
            console.log('Selected Location:', location);

            setLastClickLocation(location);
            initialMap.setCenter(latLng);

            if (circle) {
              circle.setCenter(latLng);
              circle.setRadius(radius * 1000);
            }
          }
        };

        google.maps.event.addListener(initialMap, 'click', handleMapClick);

        return () => {
          google.maps.event.clearListeners(initialMap, 'click');
        };
      }
    }
  }, [onLocationSelect, lastClickLocation, radius, speed]);

  useEffect(() => {
    if (map && lastClickLocation && radius > 0) {
      const newCircle = new google.maps.Circle({
        center: lastClickLocation,
        radius: radius * 1000,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
      });

      setCircle(newCircle);
    }
  }, [map, lastClickLocation, radius]);

  useEffect(() => {
    if (navigator.geolocation && map && !userLocationSet) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLatLng = new google.maps.LatLng(latitude, longitude);

          if (map) {
            map.setCenter(userLatLng);
            map.setZoom(12);
          }

          setUserLocationSet(true);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else if (!navigator.geolocation) {
      console.error('Geolocation not supported');
    }
  }, [map, userLocationSet]);

  return <div id="map" style={{ height: '300px', width: '50%' }}></div>;
};

export default MapComponent;