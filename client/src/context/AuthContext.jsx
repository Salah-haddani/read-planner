import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api/auth/";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  axios.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : "";

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(API_URL + "login", { email, password });

      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(API_URL + "register", {
        email,
        password,
      });

      const { token, ...userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(token);
      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Registration failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
