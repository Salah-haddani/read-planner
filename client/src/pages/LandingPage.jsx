import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, LogIn } from "lucide-react";
import image from "../assets/image.png";

const baseColor = "#3949AB";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="p-6 flex items-center justify-between max-w-6xl mx-auto border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wider transition-colors duration-500 ease-in-out hover:text-blue-600"
            style={{ color: baseColor }}
          >
            ReadPlanner
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <a
            href="#"
            className="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            About
          </a>
          <Link
            to="/login"
            className="p-2 rounded-lg hover:bg-blue-100 transition duration-200"
          >
            <LogIn className="w-5 h-5" style={{ color: baseColor }} />
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-8 py-20 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 flex justify-center items-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm h-96 border border-gray-200 shadow-lg">
            <img
              src={image}
              alt="A 3D object representing the idea of splitting expenses"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight text-gray-900">
              Master Your Reading Journey
            </h1>
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-gray-700">
              Track progress. Finish books. Build your reading habit. Say
              goodbye to unfinished books and hello to consistent reading
              success.
            </p>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 pt-6">
              <Link
                to="/register"
                className="w-full max-w-xs px-10 py-4 text-lg text-center font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-white"
                style={{ backgroundColor: baseColor }}
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="w-full max-w-xs px-10 py-4 text-lg text-center font-semibold rounded-full bg-transparent border-2 transition duration-300 ease-in-out hover:bg-blue-700 hover:text-white whitespace-nowrap text-blue-700"
                style={{ borderColor: baseColor }}
              >
                Already have account?
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
