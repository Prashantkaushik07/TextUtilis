/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
// import About from './Components/About'; // Remove if not used
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
// import ImageToWebPConverter from './Components/ImageToWebPConverter'; // Corrected the component name
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [mode, setMode] = useState('dark'); // Corrected mode state initialization to lowercase

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'black';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  };

  // Set initial background color based on the mode
  useEffect(() => {
    document.body.style.backgroundColor = mode === 'dark' ? 'black' : 'white';
  }, [mode]);

  return (
    <>
      <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
      <div className="container my-3">
        <TextForm heading="Enter the text to Analyze below" />
        {/* <ImageToWebPConverter /> */}
      </div>
    </>
  );
}

export default App;