import React from 'react';

interface InputFieldsProps {
  radius: number;
  speed: number;
  handleRadiusChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSpeedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFields: React.FC<InputFieldsProps> = ({ 
  radius, 
  speed, 
  handleRadiusChange, 
  handleSpeedChange 
}) => (
  <section className="app-section">
    <div className="input-container">
      <div className="input-group">
        <label htmlFor="radius">Enter Max Flight Radius (km): </label>
        <input 
          id="radius"
          type="number" 
          value={radius} 
          onChange={handleRadiusChange} 
          placeholder="Enter Max Flight Radius..." 
          className="app-input"
          min="0"
          max="6371"
        />
      </div>
      <div className="input-group">
        <label htmlFor="speed">Enter Speed: </label>
        <input 
          id="speed"
          type="number" 
          value={speed} 
          onChange={handleSpeedChange} 
          placeholder="Enter Speed..." 
          className="app-input"
          min="0"
        />
      </div>
    </div>
  </section>
);

export default InputFields;