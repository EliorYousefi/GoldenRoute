import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

const UserLocation: React.FC<{ setUserLocation: (location: { lat: number; lng: number }) => void }> = ({ setUserLocation }) => {
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
          },
          (error) => {
            console.error('Error fetching user location:', error);
            toast.error('Error fetching user location.');
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        toast.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, [setUserLocation]);

  return null;
};

export default UserLocation;