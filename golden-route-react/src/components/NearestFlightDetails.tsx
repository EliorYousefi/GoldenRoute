import React from 'react';

interface NearestFlightDetailsProps {
  flight: any;
  closureTime: number | null;
  speed: number;
}

const NearestFlightDetails: React.FC<NearestFlightDetailsProps> = ({ flight, closureTime, speed }) => {
  const formatClosureTime = (timeInHours: number) => {
    const totalMinutes = Math.floor(timeInHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = Math.round((timeInHours * 3600) % 60);
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <section className="app-section">
      <h2>Nearest Flight in Radius:</h2>
      <ul className="app-list">
        {flight ? (
          <li>
            <p><strong>Callsign:</strong> {flight.callsign || 'No Callsign'}</p>
            <p><strong>Latitude:</strong> {flight.latitude ?? 'N/A'}</p>
            <p><strong>Longitude:</strong> {flight.longitude ?? 'N/A'}</p>
            <p><strong>Origin Country:</strong> {flight.origin_country ?? 'N/A'}</p>
            <p><strong>Closure Time:</strong> {speed !== 0 && closureTime !== null && !isNaN(closureTime) ? formatClosureTime(closureTime) : 'N/A'}</p>
          </li>
        ) : (
          <p>No flights available within the selected radius and location.</p>
        )}
      </ul>
    </section>
  );
};

export default NearestFlightDetails;