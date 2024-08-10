import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../css/DataImportModal.css'

Modal.setAppElement('#root'); 

const API_BASE_URL = 'http://localhost:4100/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

interface Location {
  id: number;
  uavLocationLat: number;
  uavLocationLng: number;
  radius: number;
  speed: number;
  planeLocationLat: number;
  planeLocationLng: number;
}

const DataImportModal: React.FC<{ 
  isOpen: boolean, 
  onRequestClose: () => void,
  onImport: (location: Location) => void 
}> = ({ isOpen, onRequestClose, onImport }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchLocations = async () => {
      if (isOpen) {
        setLoading(true);
        try {
          const response = await api.get('/locations');
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLocations();
  }, [isOpen]);

  const handleImport = (location: Location) => {
    onImport(location);
    onRequestClose(); // close the modal after import
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/locations/${id}`);
      setLocations(locations.filter(location => location.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete('/locations');
      setLocations([]);
    } catch (error) {
      console.error('Error deleting all locations:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Import Saved Data"
      className="Modal__Content"
    >
      <div className="Modal__Header">
        <h2 className="Modal__Title">Import Saved Data</h2>
        <button onClick={onRequestClose} className="Modal__CloseButton">Close</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {locations.length > 0 ? (
            <>
              <div className="Modal__Actions">
                <button onClick={handleDeleteAll} className="delete-all">Delete All</button>
              </div>
              <ul className="Modal__List">
                {locations.map((location) => (
                  <li key={location.id} className="Modal__ListItem">
                    {`Location ID: ${location.id}, UAV Latitude: ${location.uavLocationLat}, UAV Longitude: ${location.uavLocationLng}`}
                    <div>
                      <button onClick={() => handleImport(location)}>Import</button>
                      <button onClick={() => handleDelete(location.id)} className="delete">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No locations available</p>
          )}
        </>
      )}
    </Modal>
  );
};

export default DataImportModal;