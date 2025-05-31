import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

//function to get current or latest flood ID
const getCurrentOrLatestFloodId = async () => {
  try {
    //get current active flood
    const [activeFloods] = await pool.query(
      `SELECT flood_id FROM flood 
       WHERE CURRENT_DATE BETWEEN start_date AND IFNULL(end_date, CURRENT_DATE) 
       AND flood_status = 'active' 
       ORDER BY start_date DESC LIMIT 1`
    );

    if (activeFloods.length > 0) {
      return activeFloods[0].flood_id;
    }

    //if no active flood, get the latest flood
    const [latestFloods] = await pool.query(
      `SELECT flood_id FROM flood 
       ORDER BY start_date DESC, flood_id DESC LIMIT 1`
    );

    return latestFloods[0]?.f
  } catch (error) {
    logger.error("Error getting current or latest flood ID:", error);
    throw error;
  }
};

export const createDonation = async (req, res, next) => {
  const {
    fullname,
    donation_email,
    donation_phone_number,
    category,
    message,
    divisional_secretariat_id
  } = req.body;

  //validate required fields
  if (!fullname || !donation_email || !category || !message || !divisional_secretariat_id) {
    return next(errorHandler(400, "Full name, email, category, message, and divisional_secretariat_id are required"));
  }

  //validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(donation_email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  try {
    //get current or latest flood id
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return next(errorHandler(400, "No active or recent flood event found"));
    }

    //insert new donation
    const [result] = await pool.query(
      `INSERT INTO donations 
      (fullname, donation_email, donation_phone_number, category, message, donations_status, flood_id, divisional_secretariat_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullname,
        donation_email,
        donation_phone_number || null,
        category,
        message,
        'pending', //default status
        currentFloodId,
        divisional_secretariat_id
      ]
    );

    //get the newly created donation
    const [donation] = await pool.query(
      "SELECT * FROM donations WHERE donations_id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Donation submitted successfully",
      donation: donation[0]
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(errorHandler(400, "Email already exists in our donations system"));
    }
    logger.error("Donation creation error:", error);
    next(errorHandler(500, "Failed to submit donation"));
  }
};
