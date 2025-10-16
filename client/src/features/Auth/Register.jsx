import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }
    setLocalError("");
    try {
      await register(email, password);
      navigate("/library");
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {" "}
      <div className="max-w-md w-full p-10 space-y-8 bg-white shadow-2xl rounded-xl border border-gray-200">
        {" "}
        <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-tight">
          {" "}
          Create Your <span className="text-indigo-600">ReadPlanner</span>{" "}
          Account
        </h2>
        {(error || localError) && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-300 rounded-lg text-sm transition-all duration-300">
            {" "}
            {error || localError}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {" "}
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all duration-200"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all duration-200"
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              {" "}
              Sign Up
            </button>
          </div>
        </form>
        <div className="text-sm text-center pt-2">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
