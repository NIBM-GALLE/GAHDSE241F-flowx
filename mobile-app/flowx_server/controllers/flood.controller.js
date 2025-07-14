import pool from '../utils/db.js';
import logger from '../utils/logger.js';
import { callFlaskModel } from '../utils/flaskProxy.js';

//get current flood details (latest flood row from flood table)
export const getCurrentFlood = async (req, res, next) => {
  try {
    const [floods] = await pool.query(
      `SELECT * FROM flood WHERE CURRENT_DATE BETWEEN start_date AND IFNULL(end_date, CURRENT_DATE) AND flood_status = 'active' ORDER BY start_date DESC LIMIT 1`
    );
    if (floods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active flood found',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Current flood retrieved successfully',
      data: floods[0]
    });
  } catch (error) {
    logger.error('Get current flood error:', error);
    next(error);
  }
};

//get today's flood details (from flood_details table)
export const getTodayFloodDetails = async (req, res, next) => {
  logger.debug('getTodayFloodDetails called');
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    logger.info(`DEBUG: Today value is: ${today}`);
    logger.debug(`Querying flood_details for date: ${today}`);
    // DEBUG: Log all dates in the table
    const [allDates] = await pool.query('SELECT flood_details_id, flood_details_date FROM flood_details ORDER BY flood_details_date DESC');
    logger.debug('All flood_details_date values: ' + JSON.stringify(allDates));
    const [details] = await pool.query(
      `SELECT * FROM flood_details WHERE flood_details_date = ? ORDER BY flood_details_id DESC LIMIT 1`,
      [today]
    );
    logger.debug(`Query result: ${JSON.stringify(details)}`);
    if (details.length === 0) {
      logger.info('No flood details found for today');
      return res.status(200).json({
        success: true,
        message: 'No flood details found for today',
        data: null
      });
    }
    // Add month and parse numeric fields for ML
    const date = new Date(details[0].flood_details_date || details[0].date || Date.now());
    const month = date.getMonth() + 1;
    logger.debug(`Parsed month: ${month}`);
    // Parse numeric fields (MySQL returns as string)
    const river_level = parseFloat(details[0].river_level);
    const rain_fall = parseFloat(details[0].rain_fall);
    const water_recession_level = details[0].water_rising_rate !== undefined ? parseFloat(details[0].water_rising_rate) : null;
    logger.debug(`Parsed values - river_level: ${river_level}, rain_fall: ${rain_fall}, water_recession_level: ${water_recession_level}`);
    // Compose processed data
    const processed = {
      ...details[0],
      month,
      river_level,
      rain_fall,
      water_recession_level
    };
    logger.debug(`Processed data: ${JSON.stringify(processed)}`);
    res.status(200).json({
      success: true,
      message: "Today's flood details retrieved successfully",
      data: processed
    });
  } catch (error) {
    logger.error('Get today flood details error:', error);
    next(error);
  }
};

//proxy ML prediction to Flask
export const predictFloodML = async (req, res) => {
  try {
    const { model, features } = req.body;
    if (!model || !features) {
      return res.status(400).json({ success: false, message: 'Model and features are required' });
    }
    const flaskRes = await callFlaskModel(model, features);
    res.status(200).json({ success: true, prediction: flaskRes.data.prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ML prediction failed', error: error.message });
  }
};

// Predict flood risk for a user based on distance to river and flood area
export const predictFloodRiskForUser = async (req, res, next) => {
  try {
    const { distance_to_river, flood_area } = req.body;
    logger.info(`Predicting flood risk for distance_to_river=${distance_to_river}, flood_area=${flood_area}`);
    if (distance_to_river === undefined || flood_area === undefined) {
      return res.status(400).json({ success: false, message: 'distance_to_river and flood_area are required' });
    }
    // If user's distance is less than or equal to flood area, they are at risk
    let riskLevel, message;
    if (distance_to_river <= flood_area) {
      riskLevel = 'danger';
      message = `Your home is within the predicted flood area (${distance_to_river} km to river, flood may reach up to ${flood_area} km). You are at risk!`;
    } else {
      const safeDistance = (distance_to_river - flood_area).toFixed(2);
      riskLevel = 'safe';
      message = `You are approximately ${safeDistance} km outside the predicted flood area. Stay alert, but you are currently safe.`;
    }
    logger.info(`Flood risk result: ${riskLevel} - ${message}`);
    res.status(200).json({
      success: true,
      risk: riskLevel,
      message,
      distance_to_river: parseFloat(distance_to_river),
      flood_area: parseFloat(flood_area)
    });
  } catch (error) {
    logger.error('Predict flood risk for user error:', error);
    next(error);
  }
};

// Enhanced flood risk prediction function
export const getUserFloodRiskFromDB = async (req, res, next) => {
  console.log('🟢 [getUserFloodRiskFromDB] called');
  try {
    // Support both authenticated and unauthenticated users
    let userId = null;
    if (req.user && req.user.id) {
      userId = req.user.id;
      console.log('🟢 [getUserFloodRiskFromDB] Authenticated userId:', userId);
    } else if (req.query.member_id) {
      userId = req.query.member_id;
      console.log('🟢 [getUserFloodRiskFromDB] member_id from query:', userId);
    }

    if (!userId) {
      console.log('🟢 [getUserFloodRiskFromDB] No userId found, returning default risk');
      // For unauthenticated users, return generic flood risk (e.g., for Colombo or a default location)
      // You can customize this logic as needed
      const defaultAddress = "Colombo, Sri Lanka";
      const defaultDistance = 12.5;
      const today = new Date().toISOString().slice(0, 10);
      const [floodDetails] = await pool.query(
        `SELECT flood_area, river_level, rain_fall, flood_details_date 
         FROM flood_details 
         WHERE flood_details_date = ? 
         ORDER BY flood_details_id DESC LIMIT 1`,
        [today]
      );
      if (floodDetails.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No flood data available for today'
        });
      }
      // Use the same risk calculation logic as for authenticated users
      const flood_area = parseFloat(floodDetails[0].flood_area);
      const river_level = parseFloat(floodDetails[0].river_level);
      const rain_fall = parseFloat(floodDetails[0].rain_fall);
      let status, message, distance_from_flood, riskLevel, recommendation, evacuationNeeded;
      if (defaultDistance <= flood_area) {
        status = 'flooded';
        riskLevel = 'critical';
        distance_from_flood = 0;
        evacuationNeeded = true;
        message = `⚠️ CRITICAL: Your home is within the flooded area! Immediate evacuation required.`;
        recommendation = 'Evacuate immediately to nearest safe zone. Contact emergency services if needed.';
      } else {
        distance_from_flood = parseFloat((defaultDistance - flood_area).toFixed(2));
        status = 'safe';
        evacuationNeeded = false;
        if (distance_from_flood <= 1) {
          riskLevel = 'very_high';
          message = `🚨 VERY HIGH RISK: Flood is only ${distance_from_flood} km away from your home!`;
          recommendation = 'Prepare for immediate evacuation. Pack emergency supplies and stay alert for updates.';
        } else if (distance_from_flood <= 3) {
          riskLevel = 'high';
          message = `⚡ HIGH RISK: Flood is ${distance_from_flood} km away from your home.`;
          recommendation = 'Prepare evacuation plan and emergency kit. Monitor flood updates closely.';
        } else if (distance_from_flood <= 7) {
          riskLevel = 'medium';
          message = `⚠️ MEDIUM RISK: Flood is ${distance_from_flood} km away from your home.`;
          recommendation = 'Stay informed about flood conditions. Have evacuation plan ready.';
        } else if (distance_from_flood <= 15) {
          riskLevel = 'low';
          message = `✅ LOW RISK: You are ${distance_from_flood} km away from the flood area.`;
          recommendation = 'Continue monitoring situation. You are relatively safe for now.';
        } else {
          riskLevel = 'minimal';
          message = `✅ MINIMAL RISK: You are ${distance_from_flood} km away from the flood area.`;
          recommendation = 'You are at a safe distance. Continue normal activities but stay informed.';
        }
      }
      let riskPercentage;
      if (status === 'flooded') {
        riskPercentage = 100;
      } else {
        if (distance_from_flood <= 1) riskPercentage = 90;
        else if (distance_from_flood <= 3) riskPercentage = 75;
        else if (distance_from_flood <= 7) riskPercentage = 50;
        else if (distance_from_flood <= 15) riskPercentage = 25;
        else riskPercentage = 10;
      }
      const safe_zone_distance = Math.max(flood_area + 5, 10);
      let estimated_recovery_days;
      if (river_level > 15 && rain_fall > 50) {
        estimated_recovery_days = 7;
      } else if (river_level > 10 || rain_fall > 30) {
        estimated_recovery_days = 4;
      } else {
        estimated_recovery_days = 2;
      }
      logger.info(`Flood risk calculated for unauthenticated user: ${riskLevel} - Distance: ${distance_from_flood}km`);
      return res.status(200).json({
        success: true,
        data: {
          user_location: {
            address: defaultAddress,
            distance_to_river: defaultDistance,
          },
          flood_info: {
            flood_area,
            river_level,
            rain_fall,
            date: floodDetails[0].flood_details_date
          },
          risk_assessment: {
            status,
            risk_level: riskLevel,
            risk_percentage: riskPercentage,
            distance_from_flood,
            evacuation_needed: evacuationNeeded
          },
          alert: {
            message,
            recommendation
          },
          predictions: {
            flood_area: flood_area,
            safe_zones: safe_zone_distance,
            recovery_time: estimated_recovery_days
          },
          last_updated: new Date().toISOString(),
          next_update: new Date(Date.now() + 3600000).toISOString()
        }
      });
    }

    // 1. Get user's home distance_to_river and location names from database
    console.log('🟢 [getUserFloodRiskFromDB] Querying house/location for userId:', userId);
    const [userHomes] = await pool.query(
      `SELECT h.distance_to_river, h.address,
              d.district_name, ds.divisional_secretariat_name, gnd.grama_niladhari_division_name
         FROM house h
         JOIN member m ON m.house_id = h.house_id
         JOIN district d ON h.district_id = d.district_id
         JOIN divisional_secretariat ds ON h.divisional_secretariat_id = ds.divisional_secretariat_id
         JOIN grama_niladhari_division gnd ON h.grama_niladhari_division_id = gnd.grama_niladhari_division_id
         WHERE m.member_id = ? LIMIT 1`,
      [userId]
    );
    console.log('🟢 [getUserFloodRiskFromDB] userHomes:', userHomes);
    if (userHomes.length === 0) {
      console.log('🟢 [getUserFloodRiskFromDB] No house found for user');
      return res.status(404).json({
        success: false,
        message: 'User home information not found. Please update your home location.'
      });
    }
    const distance_to_river = parseFloat(userHomes[0].distance_to_river);
    const address = userHomes[0].address;
    const district_name = userHomes[0].district_name;
    const ds_name = userHomes[0].divisional_secretariat_name;
    const gn_name = userHomes[0].grama_niladhari_division_name;
    
    // 2. Get current flood area from flood_details (today's data)
    const today = new Date().toISOString().slice(0, 10);
    const [floodDetails] = await pool.query(
      `SELECT flood_area, river_level, rain_fall, flood_details_date 
       FROM flood_details 
       WHERE flood_details_date = ? 
       ORDER BY flood_details_id DESC LIMIT 1`,
      [today]
    );
    
    if (floodDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No flood data available for today'
      });
    }
    
    const flood_area = parseFloat(floodDetails[0].flood_area);
    const river_level = parseFloat(floodDetails[0].river_level);
    const rain_fall = parseFloat(floodDetails[0].rain_fall);
    
    // 3. Calculate risk and status
    let status, message, distance_from_flood, riskLevel, recommendation, evacuationNeeded;
    
    if (distance_to_river <= flood_area) {
      // User is in flooded area
      status = 'flooded';
      riskLevel = 'critical';
      distance_from_flood = 0;
      evacuationNeeded = true;
      message = `⚠️ CRITICAL: Your home is within the flooded area! Immediate evacuation required.`;
      recommendation = 'Evacuate immediately to nearest safe zone. Contact emergency services if needed.';
    } else {
      // User is outside flood area - calculate distance to flood
      distance_from_flood = parseFloat((distance_to_river - flood_area).toFixed(2));
      status = 'safe';
      evacuationNeeded = false;
      
      // Determine risk level based on distance from flood
      if (distance_from_flood <= 1) {
        riskLevel = 'very_high';
        message = `🚨 VERY HIGH RISK: Flood is only ${distance_from_flood} km away from your home!`;
        recommendation = 'Prepare for immediate evacuation. Pack emergency supplies and stay alert for updates.';
      } else if (distance_from_flood <= 3) {
        riskLevel = 'high';
        message = `⚡ HIGH RISK: Flood is ${distance_from_flood} km away from your home.`;
        recommendation = 'Prepare evacuation plan and emergency kit. Monitor flood updates closely.';
      } else if (distance_from_flood <= 7) {
        riskLevel = 'medium';
        message = `⚠️ MEDIUM RISK: Flood is ${distance_from_flood} km away from your home.`;
        recommendation = 'Stay informed about flood conditions. Have evacuation plan ready.';
      } else if (distance_from_flood <= 15) {
        riskLevel = 'low';
        message = `✅ LOW RISK: You are ${distance_from_flood} km away from the flood area.`;
        recommendation = 'Continue monitoring situation. You are relatively safe for now.';
      } else {
        riskLevel = 'minimal';
        message = `✅ MINIMAL RISK: You are ${distance_from_flood} km away from the flood area.`;
        recommendation = 'You are at a safe distance. Continue normal activities but stay informed.';
      }
    }
    
    // 4. Calculate risk percentage for UI progress bar
    let riskPercentage;
    if (status === 'flooded') {
      riskPercentage = 100;
    } else {
      // Calculate percentage based on distance (closer = higher risk)
      if (distance_from_flood <= 1) riskPercentage = 90;
      else if (distance_from_flood <= 3) riskPercentage = 75;
      else if (distance_from_flood <= 7) riskPercentage = 50;
      else if (distance_from_flood <= 15) riskPercentage = 25;
      else riskPercentage = 10;
    }
    
    // 5. Get safe zones information (you might want to add this to your DB)
    const safe_zone_distance = Math.max(flood_area + 5, 10); // Safe zones at least 5km beyond flood area
    
    // 6. Estimate recovery time based on flood severity
    let estimated_recovery_days;
    if (river_level > 15 && rain_fall > 50) {
      estimated_recovery_days = 7; // Severe flooding
    } else if (river_level > 10 || rain_fall > 30) {
      estimated_recovery_days = 4; // Moderate flooding
    } else {
      estimated_recovery_days = 2; // Minor flooding
    }
    
    logger.info(`Flood risk calculated for user ${userId}: ${riskLevel} - Distance: ${distance_from_flood}km`);
    
    console.log('🟢 [getUserFloodRiskFromDB] Sending flood risk response');
    res.status(200).json({
      success: true,
      data: {
        // User location info
        user_location: {
          address,
          distance_to_river,
          district_name,
          ds_name,
          gn_name
        },
        
        // Current flood info
        flood_info: {
          flood_area,
          river_level,
          rain_fall,
          date: floodDetails[0].flood_details_date
        },
        
        // Risk assessment
        risk_assessment: {
          status, // 'flooded' or 'safe'
          risk_level: riskLevel, // 'critical', 'very_high', 'high', 'medium', 'low', 'minimal'
          risk_percentage: riskPercentage, // For UI progress bar
          distance_from_flood,
          evacuation_needed: evacuationNeeded
        },
        
        // Messages and recommendations
        alert: {
          message,
          recommendation
        },
        
        // Additional data for UI
        predictions: {
          flood_area: flood_area,
          safe_zones: safe_zone_distance,
          recovery_time: estimated_recovery_days
        },
        
        // Metadata
        last_updated: new Date().toISOString(),
        next_update: new Date(Date.now() + 3600000).toISOString() // Next hour
      }
    });
    
  } catch (error) {
    console.log('🔴 [getUserFloodRiskFromDB] error:', error);
    logger.error('Get user flood risk from DB error:', error);
    next(error);
  }
};

// Alternative function to get risk for any distance (for testing or manual input)
export const calculateFloodRisk = async (req, res, next) => {
  try {
    const { distance_to_river, flood_area } = req.body;
    
    if (distance_to_river === undefined || flood_area === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'distance_to_river and flood_area are required' 
      });
    }
    
    const distanceToRiver = parseFloat(distance_to_river);
    const floodArea = parseFloat(flood_area);
    
    let status, riskLevel, message, distanceFromFlood;
    
    if (distanceToRiver <= floodArea) {
      status = 'flooded';
      riskLevel = 'critical';
      distanceFromFlood = 0;
      message = 'Location is within flooded area!';
    } else {
      distanceFromFlood = parseFloat((distanceToRiver - floodArea).toFixed(2));
      status = 'safe';
      
      if (distanceFromFlood <= 1) riskLevel = 'very_high';
      else if (distanceFromFlood <= 3) riskLevel = 'high';
      else if (distanceFromFlood <= 7) riskLevel = 'medium';
      else if (distanceFromFlood <= 15) riskLevel = 'low';
      else riskLevel = 'minimal';
      
      message = `Location is ${distanceFromFlood} km away from flood area`;
    }
    
    res.status(200).json({
      success: true,
      data: {
        status,
        risk_level: riskLevel,
        distance_to_river: distanceToRiver,
        flood_area: floodArea,
        distance_from_flood: distanceFromFlood,
        message
      }
    });
    
  } catch (error) {
    logger.error('Calculate flood risk error:', error);
    next(error);
  }
};