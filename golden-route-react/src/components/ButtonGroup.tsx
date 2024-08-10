import React from 'react';
import SaveButton from './SaveButton';

interface ButtonGroupProps {
  isSaveButtonDisabled: boolean;
  openModal: () => void;
  selectedLocation: { lat: number; lng: number } | null;
  radius: number;
  speed: number;
  flight: any;
  closureTime: number | null;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ 
  isSaveButtonDisabled, 
  openModal, 
  selectedLocation, 
  radius, 
  speed, 
  flight, 
  closureTime 
}) => (
  <div className="button-group">
    <SaveButton 
      uavLocation={selectedLocation || { lat: 0, lng: 0 }} 
      radius={radius} 
      speed={speed} 
      planeLocation={{ lat: flight?.latitude || 0, lng: flight?.longitude || 0 }} 
      callsign={flight?.callsign || ''} 
      origin_country={flight?.origin_country || ''} 
      closureTime={closureTime || null} 
      disabled={isSaveButtonDisabled}
    />
    <button className="app-button" onClick={openModal}>Import Saved Data</button>
  </div>
);

export default ButtonGroup;