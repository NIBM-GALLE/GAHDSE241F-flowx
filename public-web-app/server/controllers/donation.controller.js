import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const createDonation = async (req, res, next) => {
  const {
    fullname,
    donation_email,
    donation_phone_number,
    category,
    message
  } = req.body;

  //validate required fields
  if (!fullname || !donation_email || !category || !message) {
    return next(errorHandler(400, "Full name, email, category and message are required"));
  }

  //validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(donation_email)) {
    return next(errorHandler(400, "Invalid email format"));
  }

  try {
    //insert new donation
    const [result] = await pool.query(
      `INSERT INTO donations 
      (fullname, donation_email, donation_phone_number, category, message, donations_status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fullname,
        donation_email,
        donation_phone_number || null,
        category,
        message,
        'pending' //default status
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
