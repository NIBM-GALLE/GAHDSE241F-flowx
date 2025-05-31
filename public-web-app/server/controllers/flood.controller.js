import pool from '../utils/db.js';
import logger from '../utils/logger.js';

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
    res.status(200).json({
      success: true,
      message: 'Today\'s flood details retrieved successfully',
      data: details[0]
    });
  } catch (error) {
    logger.error('Get today flood details error:', error);
    next(error);
  }
};