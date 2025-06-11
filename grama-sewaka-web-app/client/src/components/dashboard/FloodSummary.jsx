import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiWater, BiCloudRain, BiMap, BiTimeFive } from "react-icons/bi";
import { MdOutlineSafetyDivider } from "react-icons/md";

function FloodSummary() {
  const [floodData, setFloodData] = useState(null);
  const [floodRisk, setFloodRisk] = useState(0);
  const [safeZones, setSafeZones] = useState(null);
  const [recoveryTime, setRecoveryTime] = useState(null);
  const [floodArea, setFloodArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch latest flood data (public endpoint)
        const floodRes = await axios.get("/api/flood/details/today", { withCredentials: false });
        const data = floodRes.data?.data;
        if (!data) {
          setFloodData(null);
          setFloodRisk(0);
          setSafeZones(null);
          setRecoveryTime(null);
          setLoading(false);
          return;
        }
        setFloodData(data);
        // ML prediction for flood risk
        const riskRes = await axios.post("/api/flood/predict-ml", {
          model: "flood_percentage_rf",
          features: [data.month, data.rain_fall, data.river_level],
        });
        let risk = 0;
        if (
          riskRes.data &&
          riskRes.data.prediction &&
          Array.isArray(riskRes.data.prediction) &&
          riskRes.data.prediction.length > 0
        ) {
          risk = parseFloat((riskRes.data.prediction[0] * 100).toFixed(2));
        }
        setFloodRisk(risk);
        // ML prediction for flood area, safe zones, recovery time
        const { month, rain_fall, river_level, water_recession_level } = data;
        if (
          month !== undefined &&
          rain_fall !== undefined &&
          river_level !== undefined &&
          water_recession_level !== undefined
        ) {
          const features = [month, rain_fall, river_level, water_recession_level];
          // Flood area
          const floodAreaRes = await axios.post("/api/flood/predict-ml", {
            model: "flood_area",
            features,
          });
          setFloodArea(floodAreaRes.data?.prediction?.[0] ?? null);
          // Safe zones
          const safeZonesRes = await axios.post("/api/flood/predict-ml", {
            model: "flood_safe_area",
            features,
          });
          setSafeZones(safeZonesRes.data?.prediction?.[0] ?? null);
          // Recovery time
          const recoveryFeatures = [...features, floodAreaRes.data?.prediction?.[0] ?? 0];
          const recoveryRes = await axios.post("/api/flood/predict-ml", {
            model: "recover_days_xgbr",
            features: recoveryFeatures,
          });
          setRecoveryTime(recoveryRes.data?.prediction?.[0] ?? null);
        }
      } catch {
        setError("Failed to fetch flood summary data. Please try again later.");
        setFloodData(null);
        setFloodRisk(0);
        setSafeZones(null);
        setRecoveryTime(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBarColor = (percentage) => {
    if (percentage <= 40) return "bg-green-500";
    if (percentage <= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatArea = (area) => {
    if (area === null) return "-";
    return typeof area === "number" ? area.toLocaleString() + " sq km" : area;
  };

  const formatTime = (days) => {
    if (days === null) return "-";
    return typeof days === "number" ? days + " days" : days;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Flood Summary</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        floodData && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <BiWater className="w-12 h-12 mr-4 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold">Flood Risk</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div
                          className={`h-2.5 rounded-full ${getBarColor(floodRisk)}`}
                          style={{ width: `${floodRisk}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{floodRisk}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <BiCloudRain className="w-12 h-12 mr-4 text-blue-400" />
                  <div>
                    <h3 className="text-lg font-semibold">Rainfall</h3>
                    <p className="text-xl font-bold">
                      {floodData.rain_fall !== undefined
                        ? floodData.rain_fall.toFixed(2) + " mm"
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <BiMap className="w-12 h-12 mr-4 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold">River Level</h3>
                    <p className="text-xl font-bold">
                      {floodData.river_level !== undefined
                        ? floodData.river_level.toFixed(2) + " m"
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <MdOutlineSafetyDivider className="w-12 h-12 mr-4 text-yellow-600" />
                  <div>
                    <h3 className="text-lg font-semibold">Safe Zones</h3>
                    <p className="text-xl font-bold">
                      {safeZones !== null ? formatArea(safeZones) : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center">
                  <BiTimeFive className="w-12 h-12 mr-4 text-purple-600" />
                  <div>
                    <h3 className="text-lg font-semibold">Recovery Time</h3>
                    <p className="text-xl font-bold">
                      {recoveryTime !== null ? formatTime(recoveryTime) : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-2">Flood Affected Area Details</h3>
              <p className="text-sm text-gray-600 mb-2">
                Based on the latest data and machine learning predictions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Total Affected Area:</span>
                  <span className="text-sm font-semibold">
                    {floodData.affected_area !== undefined
                      ? formatArea(floodData.affected_area)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Urban Area Affected:</span>
                  <span className="text-sm font-semibold">
                    {floodData.urban_area !== undefined
                      ? formatArea(floodData.urban_area)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Rural Area Affected:</span>
                  <span className="text-sm font-semibold">
                    {floodData.rural_area !== undefined
                      ? formatArea(floodData.rural_area)
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Estimated Recovery Time:</span>
                  <span className="text-sm font-semibold">
                    {floodData.recovery_time !== undefined
                      ? formatTime(floodData.recovery_time)
                      : "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md text-center flex flex-col items-center">
              <BiCloudRain className="w-10 h-10 mb-2 text-blue-400" />
              <p className="font-semibold">Flooded Area</p>
              <p className="text-lg font-bold mt-2">{loading ? "Loading..." : formatArea(floodArea)}</p>
              <p className="text-sm text-gray-600 mt-1">Predicted affected area</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default FloodSummary;


