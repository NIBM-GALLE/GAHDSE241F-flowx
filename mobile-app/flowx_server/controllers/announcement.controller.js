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

//all announcements for current flood for a specific user
export const getCurrentFloodAnnouncementsForUser = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

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

    res.status(200).json({
      success: true,
      announcements
    });
  } catch (error) {
    logger.error("Get current flood announcements error:", error);
    next(errorHandler(500, "Failed to retrieve announcements"));
  }
};

//all announcements for current flood (no user filter)
export const getAllCurrentFloodAnnouncements = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

    logger.info("Current Flood ID:", currentFloodId);

    //get all admin announcements
    const [adminAnnouncements] = await pool.query(
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
    );

    //get all government officer announcements
    const [govOfficerAnnouncements] = await pool.query(
      `SELECT 
        'government_officer' as type,
        government_officer_announcement_id as id,
        government_officer_announcement_title as title,
        government_officer_announcement_description as description,
        emergency_level,
        government_officer_announcement_date as date,
        CONCAT(g.first_name, ' ', g.last_name) as officer_name,
        g.divisional_secretariat_id
       FROM government_officer_announcement goa
       JOIN government_officer g ON goa.government_officer_id = g.government_officer_id
       WHERE goa.flood_id = ?`,
      [currentFloodId]
    );

    //get all grama sevaka announcements
    const [gramaSevakaAnnouncements] = await pool.query(
      `SELECT 
        'grama_sevaka' as type,
        grama_sevaka_announcement_id as id,
        grama_sevaka_announcement_title as title,
        grama_sevaka_announcement_description as description,
        emergency_level,
        grama_sevaka_announcement_date as date,
        CONCAT(g.first_name, ' ', g.last_name) as sevaka_name,
        g.grama_niladhari_division_id
       FROM grama_sevaka_announcement gsa
       JOIN grama_sevaka g ON gsa.grama_sevaka_id = g.grama_sevaka_id
       WHERE gsa.flood_id = ?`,
      [currentFloodId]
    );

    //combine all announcements
    const announcements = [
      ...adminAnnouncements,
      ...govOfficerAnnouncements,
      ...gramaSevakaAnnouncements
    ];

    //sort by date descending (newest first) and then by emergency level
    announcements.sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return (b.emergency_level || 0) - (a.emergency_level || 0);
    });

    res.status(200).json({
      success: true,
      announcements
    });
  } catch (error) {
    logger.error("Get all current flood announcements error:", error);
    next(errorHandler(500, "Failed to retrieve all announcements"));
  }
};

//function to get admin announcements for current flood
export const getAdminAnnouncementsForCurrentFlood = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

    logger.info("Current Flood ID:", currentFloodId);

    //get all admin announcements for the current flood
    const [adminAnnouncements] = await pool.query(
      `SELECT 
        admin_announcement_id as id,
        admin_announcement_title as title,
        admin_announcement_description as description,
        emergency_level,
        admin_announcement_date as date
       FROM admin_announcement 
       WHERE flood_id = ?`,
      [currentFloodId]
    );

    res.status(200).json({
      success: true,
      announcements: adminAnnouncements
    });
  } catch (error) {
    logger.error("Get admin announcements error:", error);
    next(errorHandler(500, "Failed to retrieve admin announcements"));
  }
};

//function to get government officer announcements for current flood
export const getGovOfficerAnnouncementsForCurrentFlood = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

    logger.info("Current Flood ID:", currentFloodId);

    //get all government officer announcements for the current flood
    const [govOfficerAnnouncements] = await pool.query(
      `SELECT 
        government_officer_announcement_id as id,
        government_officer_announcement_title as title,
        government_officer_announcement_description as description,
        emergency_level,
        government_officer_announcement_date as date,
        CONCAT(g.first_name, ' ', g.last_name) as officer_name
       FROM government_officer_announcement goa
       JOIN government_officer g ON goa.government_officer_id = g.government_officer_id
       WHERE goa.flood_id = ?`,
      [currentFloodId]
    );

    res.status(200).json({
      success: true,
      announcements: govOfficerAnnouncements
    });
  } catch (error) {
    logger.error("Get government officer announcements error:", error);
    next(errorHandler(500, "Failed to retrieve government officer announcements"));
  }
};

//function to get grama sevaka announcements for current flood
export const getGramaSevakaAnnouncementsForCurrentFlood = async (req, res, next) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    if (!currentFloodId) {
      return res.status(200).json({
        success: true,
        message: "No active flood event",
        announcements: []
      });
    }

    logger.info("Current Flood ID:", currentFloodId);

    //get all grama sevaka announcements for the current flood
    const [gramaSevakaAnnouncements] = await pool.query(
      `SELECT 
        grama_sevaka_announcement_id as id,
        grama_sevaka_announcement_title as title,
        grama_sevaka_announcement_description as description,
        emergency_level,
        grama_sevaka_announcement_date as date,
        CONCAT(g.first_name, ' ', g.last_name) as sevaka_name
       FROM grama_sevaka_announcement gsa
       JOIN grama_sevaka g ON gsa.grama_sevaka_id = g.grama_sevaka_id
       WHERE gsa.flood_id = ?`,
      [currentFloodId]
    );

    res.status(200).json({
      success: true,
      announcements: gramaSevakaAnnouncements
    });
  } catch (error) {
    logger.error("Get grama sevaka announcements error:", error);
    next(errorHandler(500, "Failed to retrieve grama sevaka announcements"));
  }
};

// Export all functions
export {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements,
  getAdminAnnouncementsForCurrentFlood,
  getGovOfficerAnnouncementsForCurrentFlood,
  getGramaSevakaAnnouncementsForCurrentFlood
};