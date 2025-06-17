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

//new victim request
export const createVictimRequest = async (req, res, next) => {
    try {
        const currentFloodId = await getCurrentOrLatestFloodId();
        if (!currentFloodId) {
            return next(errorHandler(400, "No active flood event"));
        }

        const { 
            title, 
            message, 
            emergency_level, 
            needs
        } = req.body;

        //get member's house_id
        const [memberRows] = await pool.query(
            "SELECT house_id FROM member WHERE member_id = ?",
            [req.user.member_id]
        );

        if (!memberRows.length) {
            return next(errorHandler(404, "Member not found"));
        }

        const houseId = memberRows[0].house_id;

        //check if user or user's house has already placed a request for current flood
        const [existingRequests] = await pool.query(`
            SELECT vr.victim_request_status 
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            WHERE vr.flood_id = ? AND (vr.member_id = ? OR m.house_id = ?)
            ORDER BY vr.victim_request_date DESC
            LIMIT 1
        `, [currentFloodId, req.user.member_id, houseId]);

        //check if there's an existing request with 'reject' status
        if (existingRequests.length > 0 && existingRequests[0].victim_request_status === 'reject') {
            return next(errorHandler(403, "Cannot place request. Previous request was rejected."));
        }

        //check if there's already a pending or approved request
        const hasPending = existingRequests.some(
            req => req.victim_request_status === 'pending' || req.victim_request_status === 'approved'
        );

        if (hasPending) {
            return next(errorHandler(400, "You already have a pending or approved request for this flood event"));
        }

        //insert the main request
        const [result] = await pool.query(
            `INSERT INTO victim_request (
                victim_request_title,
                victim_request_message,
                emergency_level,
                needs,
                victim_request_status,
                member_id,
                flood_id
            ) VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
            [title, message, emergency_level, needs, req.user.member_id, currentFloodId]
        );

        res.status(201).json({
            success: true,
            message: "Request submitted successfully",
            requestId: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return next(errorHandler(400, "You have already submitted a request for this flood event"));
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return next(errorHandler(404, "Flood event not found"));
        }
        if (error.code === 'ER_BAD_NULL_ERROR') {
            return next(errorHandler(400, "Missing required fields"));
        }
        if (error.code === 'ER_DATA_TOO_LONG') {
            return next(errorHandler(400, "Request data is too long"));
        }
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
            return next(errorHandler(400, "Invalid data format"));
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return next(errorHandler(500, "Database table not found"));
        }
        if (error.code === 'ER_SYNTAX_ERROR') {
            return next(errorHandler(400, "Syntax error in request data"));
        }
        if (error.code === 'ER_PARSE_ERROR') {
            return next(errorHandler(400, "Error parsing request data"));
        }
        logger.error("Create victim request error:", error);
        next(errorHandler(500, "Failed to submit request"));
    }
};

//get request history
export const getVictimRequests = async (req, res, next) => {
    try {
        const currentFloodId = await getCurrentOrLatestFloodId();
        //get user's house ID
        const [user] = await pool.query(
            `SELECT house_id FROM member WHERE member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const houseId = user[0].house_id;

        //first query for get requests for current flood by member or house
        const [currentFloodRequests] = await pool.query(`
            SELECT vr.*, m.first_name, m.last_name, m.member_phone_number
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            WHERE vr.flood_id = ? AND (vr.member_id = ? OR m.house_id = ?)
            ORDER BY vr.victim_request_date DESC
        `, [currentFloodId, req.user.member_id, houseId]);

        //second query for get all requests for the house across all floods
        const [allHouseRequests] = await pool.query(`
            SELECT vr.*, m.first_name, m.last_name, m.member_phone_number, f.flood_name, f.start_date, f.end_date
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            JOIN flood f ON vr.flood_id = f.flood_id
            WHERE m.house_id = ?
            ORDER BY vr.victim_request_date DESC
        `, [houseId]);

        res.status(200).json({
            success: true,
            data: {
                currentFloodRequests,
                allHouseRequests,
                currentFloodId
            }
        });

    } catch (error) {
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
            return next(errorHandler(404, "Flood event not found"));
        }
        if (error.code === 'ER_BAD_NULL_ERROR') {
            return next(errorHandler(400, "Missing required fields"));
        }
        if (error.code === 'ER_DATA_TOO_LONG') {
            return next(errorHandler(400, "Request data is too long"));
        }
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
            return next(errorHandler(400, "Invalid data format"));
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return next(errorHandler(500, "Database table not found"));
        }
        if (error.code === 'ER_SYNTAX_ERROR') {
            return next(errorHandler(400, "Syntax error in request data"));
        }
        logger.error("Get victim requests error:", error);
        next(errorHandler(500, "Failed to get requests"));
    }
};