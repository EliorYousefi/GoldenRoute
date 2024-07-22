import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // submit button 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputValue); 

    // send value to server with post request
    axios.post('/api/submit', { value: inputValue })
      .then(response => setMessage(response.data.message))
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter some text"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
