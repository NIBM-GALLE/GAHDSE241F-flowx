import { pool } from "../utils/db.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

//function to get current or latest flood ID
const getCurrentOrLatestFloodId = async () => {
    try {
        //get current active flood
        const [activeFloods] = await pool.query(
            `SELECT flood_id FROM flood 
             WHERE CURRENT_DATE BETWEEN start_date AND IFNULL(end_date, CURRENT_DATE)
             AND flood_status = 'active'
             ORDER BY start_date DESC
             LIMIT 1`
        );

        if (activeFloods.length > 0) {
            return activeFloods[0].flood_id;
        }

        //if no active flood, get the latest flood
        const [latestFloods] = await pool.query(
            `SELECT flood_id FROM flood 
             ORDER BY start_date DESC, flood_id DESC
             LIMIT 1`
        );

        return latestFloods[0]?.flood_id || null;
    } catch (error) {
        logger.error("Error getting current or latest flood ID:", error);
        throw error;
    }
};

//function to request new shelter
export const requestShelter = async (req, res, next) => {
    try {
        const { shelter_request_title, shelter_request_message, shelter_request_needs, emergency_level } = req.body;

        //validate required fields
        if (!shelter_request_title || !shelter_request_message || !shelter_request_needs || !emergency_level) {
            return next(errorHandler(400, "All fields are required"));
        }

        //get user's house ID
        const [user] = await pool.query(
            `SELECT house_id FROM member WHERE member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const houseId = user[0].house_id;

        //get current or latest flood ID
        const floodId = await getCurrentOrLatestFloodId();
        if (!floodId) {
            logger.error("No active flood found");
            return next(errorHandler(404, "No active flood found"));
        }

        //check if there's already a pending request
        const [existingRequest] = await pool.query(
            `SELECT * FROM shelter_request 
             WHERE house_id = ? AND flood_id = ? AND shelter_request_status = 'pending'`,
            [houseId, floodId]
        );

        if (existingRequest.length > 0) {
            return res.status(200).json({
                success: false,
                message: "Already requested. Wait for the response.",
                data: existingRequest[0]
            });
        }

        //insert new shelter request
        const [result] = await pool.query(
            `INSERT INTO shelter_request 
             (shelter_request_title, shelter_request_message, shelter_request_needs, 
              emergency_level, shelter_request_status, house_id, flood_id) 
             VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
            [shelter_request_title, shelter_request_message, shelter_request_needs, emergency_level, houseId, floodId]
        );

        res.status(201).json({
            success: true,
            message: "Shelter request submitted successfully",
            data: {
                requestId: result.insertId,
                status: 'pending',
                floodId: floodId,
                houseId: houseId
            }
        });

    } catch (error) {
        logger.error("Request shelter error:", error);
        next(errorHandler(500, "Failed to submit shelter request"));
    }
};

//function to get assigned shelter and all available shelters
export const getShelterInfo = async (req, res, next) => {
    try {
        //get user's house ID and divisional secretariat ID
        const [user] = await pool.query(
            `SELECT h.house_id, h.divisional_secretariat_id 
             FROM member m
             JOIN house h ON m.house_id = h.house_id
             WHERE m.member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const { house_id: houseId, divisional_secretariat_id: divisionalSecretariatId } = user[0];

        //get assigned shelter for the house (from shelter_house)
        const [assignedShelter] = await pool.query(
            `SELECT sh.*, s.shelter_name, s.shelter_size, s.shelter_address, s.available, 
                    s.shelter_status, s.divisional_secretariat_id, s.latitude, s.longitude,
                    f.flood_name, f.start_date, f.end_date
             FROM shelter_house sh
             JOIN shelter s ON sh.shelter_id = s.shelter_id
             LEFT JOIN flood f ON sh.flood_id = f.flood_id
             WHERE sh.house_id = ?
             ORDER BY sh.shelter_house_id DESC
             LIMIT 1`,
            [houseId]
        );

        //get all shelters in user's divisional secretariat
        const [allShelters] = await pool.query(
            `SELECT shelter_id, shelter_name, shelter_size, shelter_address, available, 
                    shelter_status, divisional_secretariat_id, latitude, longitude
             FROM shelter 
             WHERE divisional_secretariat_id = ?
             ORDER BY shelter_name`,
            [divisionalSecretariatId]
        );

        res.status(200).json({
            success: true,
            message: "Shelter information retrieved successfully",
            data: {
                assignedShelter: assignedShelter.length > 0 ? assignedShelter[0] : null,
                allShelters: allShelters,
                houseId: houseId,
                divisionalSecretariatId: divisionalSecretariatId
            }
        });

    } catch (error) {
        logger.error("Get shelter info error:", error);
        next(errorHandler(500, "Failed to get shelter information"));
    }
};

//function to get shelter request history
export const getShelterRequestHistory = async (req, res, next) => {
    try {
        //get user's house ID
        const [user] = await pool.query(
            `SELECT house_id FROM member WHERE member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const houseId = user[0].house_id;

        //get all shelter requests for this house
        const [requestHistory] = await pool.query(
            `SELECT sr.*, f.flood_name, f.start_date, f.end_date,
                    h.address as house_address
             FROM shelter_request sr
             LEFT JOIN flood f ON sr.flood_id = f.flood_id
             LEFT JOIN house h ON sr.house_id = h.house_id
             WHERE sr.house_id = ?
             ORDER BY sr.shelter_request_id DESC`,
            [houseId]
        );

        res.status(200).json({
            success: true,
            message: requestHistory.length > 0 ? "Shelter request history retrieved" : "No shelter request history found",
            data: {
                requestHistory: requestHistory,
                houseId: houseId,
                totalRequests: requestHistory.length
            }
        });

    } catch (error) {
        logger.error("Get shelter request history error:", error);
        next(errorHandler(500, "Failed to get shelter request history"));
    }
};

//function to get user related shelters 
export const getUserRelatedShelters = async (req, res, next) => {
    try {
        //get user's house ID
        const [user] = await pool.query(
            `SELECT house_id FROM member WHERE member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const houseId = user[0].house_id;

        //get all shelters related to the user's house
        const [relatedShelters] = await pool.query(
            `SELECT s.shelter_id, s.shelter_name, s.shelter_size, s.shelter_address, s.available, 
                    s.shelter_status, s.divisional_secretariat_id, s.latitude, s.longitude, sh.shelter_house_id, 
                    f.flood_name, f.start_date, f.end_date
             FROM shelter s
             LEFT JOIN shelter_house sh ON s.shelter_id = sh.shelter_id AND sh.house_id = ?
             LEFT JOIN flood f ON sh.flood_id = f.flood_id
             WHERE s.divisional_secretariat_id IN (
                 SELECT divisional_secretariat_id FROM house WHERE house_id = ?
             )
             ORDER BY s.shelter_name`,
            [houseId, houseId]
        );

        res.status(200).json({
            success: true,
            message: "User related shelters retrieved successfully",
            data: {
                relatedShelters: relatedShelters,
                houseId: houseId
            }
        });

    } catch (error) {
        logger.error("Get user related shelters error:", error);
        next(errorHandler(500, "Failed to get user related shelters"));
    }
};