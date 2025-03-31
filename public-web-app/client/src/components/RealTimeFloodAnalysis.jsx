import React, { useEffect, useState } from "react";
import floodIcon from "../assets/flood.png";
import RainIcon from "../assets/rain.png";
import RiverIcon from "../assets/river.png";
import supabase from "../lib/supabaseClient";
import axioInstance from "../lib/axioInstance";
import FloodImpactPrediction from "./FloodImpactPrediction";

function RealTimeFloodAnalysis({ onHighRiskDetected }) {
  const [floodData, setFloodData] = useState(null);
  const [floodRisk, setFloodRisk] = useState(0);
  const [showImpactPrediction, setShowImpactPrediction] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        let { data: flood_data, error } = await supabase
          .from("flood_data")
          .select("*")
          .order("date", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Error fetching flood data:", error);
        } else {
          const processedData = flood_data.map((item) => {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            return { ...item, month };
          });

          setFloodData(processedData[0]);

          const response = await axioInstance.post("/flood_percentage_rf", {
            features: [
              processedData[0].month,
              processedData[0].rain_fall,
              processedData[0].river_level,
            ],
          });

          if (
            response.data &&
            response.data.prediction &&
            Array.isArray(response.data.prediction) &&
            response.data.prediction.length > 0
          ) {
            const percentage = response.data.prediction[0] * 100;
            const formattedPercentage = parseFloat(percentage.toFixed(2));
            setFloodRisk(formattedPercentage);

            if (formattedPercentage > 70) {
              setShowImpactPrediction(true);
              if (onHighRiskDetected) {
                onHighRiskDetected({
                  risk: formattedPercentage,
                  data: processedData[0],
                });
              }
            } else {
              setShowImpactPrediction(false);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching flood data:", error);
      }
    };

    getData();
  }, [onHighRiskDetected]);

  const getBarColor = (percentage) => {
    if (percentage <= 40) return "bg-green-500";
    if (percentage <= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <>
      <section
        className="px-6 md:px-12 py-10 bg-white text-gray-900 flex justify-center"
        id="real-time-flood-analysis"
      >
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <img src={floodIcon} alt="Flood Icon" className="w-8 h-8" />
            REAL-TIME FLOOD ANALYSIS
          </h2>
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="font-semibold flex items-center gap-2">
              <img src={floodIcon} alt="Flood Risk" className="w-6 h-6" />
              Flood Risk
            </p>
            <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
              <div
                className={`${getBarColor(floodRisk)} h-4 rounded-full`}
                style={{ width: `${floodRisk}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {floodRisk}% risk detected
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center flex flex-col items-center">
              <img
                src={RiverIcon}
                alt="River Water Level"
                className="w-10 h-10 mb-2"
              />
              <p className="font-semibold">River Level</p>
              <p className="text-2xl font-bold">{floodData?.river_level} M</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md text-center flex flex-col items-center">
              <img
                src={RainIcon}
                alt="Today's Rainfall"
                className="w-10 h-10 mb-2"
              />
              <p className="font-semibold">Today's Rainfall</p>
              <p className="text-2xl font-bold">{floodData?.rain_fall} MM</p>
            </div>
          </div>
        </div>
      </section>

      {showImpactPrediction && floodData && (
        <FloodImpactPrediction floodData={floodData} />
      )}
    </>
  );
}

export default RealTimeFloodAnalysis;
