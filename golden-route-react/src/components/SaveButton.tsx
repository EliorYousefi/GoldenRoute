import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Location {
  lat: number;
  lng: number;
}

interface SaveButtonProps {
  uavLocation: Location;
  radius: number;
  speed: number;
  planeLocation: Location;
  callsign: string;
  origin_country: string;
  closureTime: number | null;
  disabled: boolean;
}

const API_BASE_URL = 'http://localhost:4100/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

const SaveButton: React.FC<SaveButtonProps> = ({
  uavLocation,
  radius,
  speed,
  planeLocation,
  callsign,
  origin_country,
  closureTime,
  disabled,
}) => {
  const handleSave = async () => {
    try {
      await api.post('/locations', {
        uavLocation,
        radius,
        speed,
        planeLocation,
        callsign,
        origin_country,
        closureTime,
      });

      toast.success('Data saved successfully.');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  return (
    <button onClick={handleSave} disabled={disabled}>
      Save
    </button>
  );
};

export default SaveButton;
