// src/App.js
import React, { useState, useEffect } from 'react';
import Login from './Components/Login';       // <-- separate login component
import Navbar from './Components/Navbar';     // <-- your navbar
import TextForm from './Components/TextForm'; // <-- your text utility form
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  // Track if a user is logged in (null means not logged in)
  const [user, setUser] = useState(null);

  // Dark/Light mode state
  const [mode, setMode] = useState('dark');

  // Toggle between dark and light
  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  };

  // Whenever `mode` changes, update the page styles
  useEffect(() => {
    document.body.style.backgroundColor = mode === 'dark' ? 'black' : 'white';
    document.body.style.color = mode === 'dark' ? 'white' : 'black';
  }, [mode]);

  // This function is passed to <Login> and called upon successful login
  const handleLogin = (userData) => {
    setUser(userData); 
  };

  // Called on “Logout” to clear the user
  const handleLogout = () => {
    setUser(null);
  };

  // If user is NOT logged in, show the <Login> component
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // If user is logged in, show the main TextUtils content
  return (
    <div className="App">
      {/* Example welcome. You can change “Prashant Kaushik” to user.email if you like. */}
      <h1>Welcome, {user.TextForm} Prashant Kaushik</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Rest of your app (e.g., text utilities) goes here */}
      <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />

      <div className="container my-3">
        <TextForm heading="Enter the text to Analyze below" />
      </div>
    </div>
  );
}

export default App;
