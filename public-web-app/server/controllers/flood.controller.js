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
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const [details] = await pool.query(
      `SELECT * FROM flood_details WHERE flood_details_date = ? ORDER BY flood_details_id DESC LIMIT 1`,
      [today]
    );
    if (details.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No flood details found for today',
        data: null
      });
    }
    // Add month and parse numeric fields for ML
    const date = new Date(details[0].flood_details_date || details[0].date || Date.now());
    const month = date.getMonth() + 1;
    // Parse numeric fields (MySQL returns as string)
    const river_level = parseFloat(details[0].river_level);
    const rain_fall = parseFloat(details[0].rain_fall);
    const water_recession_level = details[0].water_rising_rate !== undefined ? parseFloat(details[0].water_rising_rate) : null;
    // Compose processed data
    const processed = {
      ...details[0],
      month,
      river_level,
      rain_fall,
      water_recession_level
    };
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