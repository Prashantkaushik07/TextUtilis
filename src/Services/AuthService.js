// src/Services/AuthService.js

// Example Auth Service
// - signup(email, password): sends POST /signup
// - login(email, password): sends POST /login
// - logout(): clears token from localStorage (or cookies)
// - getToken(): retrieves token if needed

const API_URL = "http://localhost:5000/api"; // your backend base URL

async function signup(email, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }
  // Could return some success message or user data
  return response.json(); // e.g. { message: "User created successfully!" }
}

async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  // data might look like: { message, token, user: { id, email } }

  // Store token in local storage (or cookies)
  if (data.token) {
    localStorage.setItem("authToken", data.token);
  }

  // Return user data
  return data;
}

function logout() {
  // Remove token or do other cleanup
  localStorage.removeItem("authToken");
}

function getToken() {
  return localStorage.getItem("authToken");
}

const AuthService = {
  signup,
  login,
  logout,
  getToken,
};

export default AuthService;
