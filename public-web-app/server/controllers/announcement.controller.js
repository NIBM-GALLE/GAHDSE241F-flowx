import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

//get current flood ID
const getCurrentFloodId = async () => {
  try {
    const [floods] = await pool.query(
      `SELECT flood_id FROM flood 
       WHERE CURRENT_DATE BETWEEN start_date AND IFNULL(end_date, CURRENT_DATE) 
       AND flood_status = 'active' 
       LIMIT 1`
    );

    //debugging log
    logger.info("Current floods found:", floods);
    return floods.length > 0 ? floods[0].flood_id : null;
  } catch (error) {
    logger.error("Error getting current flood ID:", error);
    throw error;
  }
};

//all announcements for current flood
export const getCurrentFloodAnnouncements = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

    //print current flood ID for debugging
    logger.info("Current Flood ID:", currentFloodId);

    //get user details
    const [user] = await pool.query(
      `SELECT h.divisional_secretariat_id, h.grama_niladhari_division_id
       FROM member m
       JOIN house h ON m.house_id = h.house_id
       WHERE m.member_id = ?`,
      [req.user.member_id]
    );

    if (user.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    const divisionalSecretariatId = user[0].divisional_secretariat_id;
    const gramaNiladhariDivisionId = user[0].grama_niladhari_division_id;

    //get the all announcements for the current flood
    const [adminAnnouncements, govOfficerAnnouncements, gramaSevakaAnnouncements] = await Promise.all([
      pool.query(
        `SELECT 
          'admin' as type,
          admin_announcement_id as id,
          admin_announcement_title as title,
          admin_announcement_description as description,
          emergency_level,
          admin_announcement_date as date
         FROM admin_announcement 
         WHERE flood_id = ?`,
        [currentFloodId]
      ),
      pool.query(
        `SELECT 
          'government_officer' as type,
          government_officer_announcement_id as id,
          government_officer_announcement_title as title,
          government_officer_announcement_description as description,
          emergency_level,
          government_officer_announcement_date as date,
          CONCAT(g.first_name, ' ', g.last_name) as officer_name
         FROM government_officer_announcement goa
         JOIN government_officer g ON goa.government_officer_id = g.government_officer_id
         WHERE goa.flood_id = ? AND g.divisional_secretariat_id = ?`,
        [currentFloodId, divisionalSecretariatId]
      ),
      pool.query(
        `SELECT 
          'grama_sevaka' as type,
          grama_sevaka_announcement_id as id,
          grama_sevaka_announcement_title as title,
          grama_sevaka_announcement_description as description,
          emergency_level,
          grama_sevaka_announcement_date as date,
          CONCAT(g.first_name, ' ', g.last_name) as sevaka_name
         FROM grama_sevaka_announcement gsa
         JOIN grama_sevaka g ON gsa.grama_sevaka_id = g.grama_sevaka_id
         WHERE gsa.flood_id = ? AND g.grama_niladhari_division_id = ?`,
        [currentFloodId, gramaNiladhariDivisionId]
      )
    ]);

    //combine all announcements
    const announcements = [
      ...adminAnnouncements[0],
      ...govOfficerAnnouncements[0],
      ...gramaSevakaAnnouncements[0]
    ];

    //sort by date descending (newest first) and then by emergency level
    announcements.sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return (b.emergency_level || 0) - (a.emergency_level || 0);
    });

    //return combined announcements
    res.status(200).json({
      success: true,
      announcements
    });

  } catch (error) {
    logger.error("Get current flood announcements error:", error);
    next(errorHandler(500, "Failed to retrieve announcements"));
  }
};