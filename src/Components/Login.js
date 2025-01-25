import React, { useState } from "react";
import "./LoginForm.css"; // Make sure this contains the new blurred circle and glass styles

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fake login check (replace with real API call in production)
  const handleFakeLoginCheck = (enteredEmail, enteredPassword) => {
    const validEmail = "Prashantkaushik700@gmail.com";
    const validPassword = "Kaushik";
    return enteredEmail === validEmail && enteredPassword === validPassword;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const isValid = handleFakeLoginCheck(email, password);
    if (isValid) {
      // Pass user info (e.g., email) back to parent
      onLogin({ email });
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center">
      {/* Blurred gradient circles */}
      <div className="circle circle-blue"></div>
      <div className="circle circle-orange"></div>

      {/* Glassmorphism form */}
      <form className="glass-form" onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email or Phone"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button type="submit">Log In</button>

        {errorMessage && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
