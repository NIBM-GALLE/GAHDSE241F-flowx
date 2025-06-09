import React, { useEffect, useState } from "react";
import RainIcon from "@/assets/rain.png";
import FloodIcon from "@/assets/flood.png";
import SafeZoneIcon from "@/assets/safezone.png";
import DurationIcon from "@/assets/duration.png";
import axios from "axios";

function FloodImpactPrediction({ floodData }) {
  const [floodArea, setFloodArea] = useState(null);
  const [safeZones, setSafeZones] = useState(null);
  const [recoveryTime, setRecoveryTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImpactData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!floodData) {
          setLoading(false);
          return;
        }
        // Ensure all required features are present
        const { month, rain_fall, river_level, water_recession_level } = floodData;
        if (
          month === undefined ||
          rain_fall === undefined ||
          river_level === undefined ||
          water_recession_level === undefined
        ) {
          setError("Flood data is incomplete for prediction.");
          setLoading(false);
          return;
        }
        // All fields are now numbers (from backend)
        const features = [month, rain_fall, river_level, water_recession_level];
        // Step 1: Fetch flood area prediction
        const floodAreaResponse = await axios.post("/api/flood/predict-ml", {
          model: "flood_area",
          features,
        });
        if (!floodAreaResponse.data || !Array.isArray(floodAreaResponse.data.prediction) || floodAreaResponse.data.prediction.length === 0) {
          throw new Error("Invalid response from flood_area");
        }
        const floodAreaPrediction = floodAreaResponse.data.prediction[0];
        setFloodArea(floodAreaPrediction);
        // Step 2: Fetch safe zones prediction
        const safeZonesResponse = await axios.post("/api/flood/predict-ml", {
          model: "flood_safe_area",
          features,
        });
        if (!safeZonesResponse.data || !Array.isArray(safeZonesResponse.data.prediction) || safeZonesResponse.data.prediction.length === 0) {
          throw new Error("Invalid response from flood_safe_area");
        }
        const safeZonesPrediction = safeZonesResponse.data.prediction[0];
        setSafeZones(safeZonesPrediction);
        // Step 3: Fetch recovery time prediction
        const recoveryFeatures = [...features, floodAreaPrediction];
        const recoveryResponse = await axios.post("/api/flood/predict-ml", {
          model: "recover_days_xgbr",
          features: recoveryFeatures,
        });
        if (!recoveryResponse.data || !Array.isArray(recoveryResponse.data.prediction) || recoveryResponse.data.prediction.length === 0) {
          throw new Error("Invalid response from recover_days_xgbr");
        }
        const recoveryPrediction = recoveryResponse.data.prediction[0];
        setRecoveryTime(recoveryPrediction);
      } catch (error) {
        setError("Failed to fetch flood impact data. Please try again later.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImpactData();
  }, [floodData]);

  const formatArea = (area) => {
    if (area === null) return "Calculating...";
    return `${area.toFixed(2)} sq km`;
  };

  const formatSafeZones = (zones) => {
    if (zones === null) return "Calculating...";
    return `${zones.toFixed(2)} sq km`;
  };

  const formatRecoveryTime = (days) => {
    if (days === null) return "Calculating...";

    const roundedDays = parseFloat(days.toFixed(1));

    if (roundedDays === 1) {
      return "1 day";
    } else if (roundedDays === 0.5) {
      return "0.5 days";
    } else {
      return `${roundedDays} days`;
    }
  };

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  // Only render if floodData is available
  if (!floodData) {
    return null;
  }

  return (
    <section
      className="px-6 md:px-12 py-10 text-gray-900 flex justify-center"
      id="flood-impact-prediction"
    >
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <img src={FloodIcon} alt="Flood Icon" className="w-8 h-8" />
          FLOOD IMPACT PREDICTION
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
            <img src={RainIcon} alt="Flooded Area" className="w-10 h-10 mb-2" />
            <p className="font-semibold">Flooded Area</p>
            <p className="text-lg font-bold mt-2">
              {loading ? "Loading..." : formatArea(floodArea)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Predicted affected area
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
            <img
              src={SafeZoneIcon}
              alt="Safe Zones"
              className="w-10 h-10 mb-2"
            />
            <p className="font-semibold">Safe Zones</p>
            <p className="text-lg font-bold mt-2">
              {loading ? "Loading..." : formatSafeZones(safeZones)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Recommended evacuation areas
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
            <img
              src={DurationIcon}
              alt="Estimated Recovery Time"
              className="w-10 h-10 mb-2"
            />
            <p className="font-semibold">Estimated Recovery Time</p>
            <p className="text-lg font-bold mt-2">
              {loading ? "Loading..." : formatRecoveryTime(recoveryTime)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Time until normalcy returns
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FloodImpactPrediction;
