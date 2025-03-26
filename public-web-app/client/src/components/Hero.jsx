import React from "react";
import HeroImg from "../assets/hero.png";

function Hero() {
  return (
    <section
      className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10 h-screen pt-30 md:pt-0"
      id="hero"
    >
      <div className="w-full md:w-1/2">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900">
          National Flood Services is now{" "}
          <span className="text-blue-600">FlowX</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700">
          New Technology. New Service. New Standard.
        </p>
        <button className="mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          <a href="#real-time-flood-analysis">Get News</a>
        </button>
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <img
          src={HeroImg}
          alt="Flood Illustration"
          className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto"
        />
      </div>
    </section>
  );
}

export default Hero;
