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

//function to new subsidies (pending subsidies for current/latest flood)
export const getNewSubsidies = async (req, res, next) => {
    try {
        // Get user's house ID
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
            return res.status(200).json({
                success: true,
                message: "No flood events found",
                subsidies: []
            });
        }

        //check subsidy_house table where house_id = logged user house and subsidies_status = pending
        const [subsidies] = await pool.query(`
            SELECT sh.*, s.subsidy_name, s.category as subsidy_category, s.flood_id, 
                   g.grama_sevaka_id, g.first_name as grama_sevaka_first_name, g.last_name as grama_sevaka_last_name, g.grama_sevaka_phone_number,
                   h.address as house_address
            FROM subsidy_house sh
            JOIN subsidies s ON sh.subsidies_id = s.subsidies_id
            JOIN house h ON sh.house_id = h.house_id
            JOIN grama_sevaka g ON sh.grama_sevaka_id = g.grama_sevaka_id
            WHERE sh.house_id = ? AND s.flood_id = ? AND sh.subsidies_status = 'pending'
            ORDER BY sh.subsidy_house_id DESC
        `, [houseId, floodId]);

        res.status(200).json({
            success: true,
            message: subsidies.length > 0 ? "New subsidies found" : "No new subsidies available",
            data: {
                subsidies: subsidies,
                floodId: floodId,
                houseId: houseId
            }
        });

    } catch (error) {
        if (error.code === 'ER_BAD_FIELD_ERROR') {
            return next(errorHandler(400, "Invalid field in query"));
        }
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return next(errorHandler(500, "Database table not found"));
        }
        if (error.code === 'ER_SYNTAX_ERROR') {
            return next(errorHandler(400, "Syntax error in query"));
        }
        if (error.code === 'ER_PARSE_ERROR') {
            return next(errorHandler(400, "Error parsing query"));
        }
        
        logger.error("Get new subsidies error:", error);
        next(errorHandler(500, "Failed to get new subsidies"));
    }
};

//function to get subsidies history (collected subsidies)
export const getSubsidiesHistory = async (req, res, next) => {
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

        //select all collected subsidies for this house
        const [subsidiesHistory] = await pool.query(`
            SELECT sh.*, s.subsidy_name, s.category as subsidy_category, s.flood_id, 
                   g.grama_sevaka_id, g.first_name as grama_sevaka_first_name, g.last_name as grama_sevaka_last_name, g.grama_sevaka_phone_number,
                   h.address as house_address
            FROM subsidy_house sh
            JOIN subsidies s ON sh.subsidies_id = s.subsidies_id
            JOIN house h ON sh.house_id = h.house_id
            JOIN grama_sevaka g ON sh.grama_sevaka_id = g.grama_sevaka_id
            WHERE sh.house_id = ? AND sh.subsidies_status = 'collected'
            ORDER BY sh.subsidy_house_id DESC
        `, [houseId]);

        res.status(200).json({
            success: true,
            message: subsidiesHistory.length > 0 ? "Subsidies history retrieved" : "No subsidies history found",
            data: {
                subsidiesHistory: subsidiesHistory,
                houseId: houseId,
                totalCollected: subsidiesHistory.length
            }
        });

    } catch (error) {
        logger.error("Get subsidies history error:", error);
        next(errorHandler(500, "Failed to get subsidies history"));
    }
};

//function to get all subsidies for a specific flood
export const getAllSubsidiesForFlood = async (req, res, next) => {
    //get current or latest flood ID
    const floodId = await getCurrentOrLatestFloodId();
    if (!floodId) {
        return res.status(200).json({
            success: true,
            message: "No flood events found",
            subsidies: []
        });
    }

    try {
        //get all subsidies for the specified flood
        const [subsidies] = await pool.query(`
            SELECT sh.*, s.subsidy_name, s.category as subsidy_category, s.flood_id, 
                   g.grama_sevaka_id, g.first_name as grama_sevaka_first_name, g.last_name as grama_sevaka_last_name, g.grama_sevaka_phone_number,
                   h.address as house_address
            FROM subsidy_house sh
            JOIN subsidies s ON sh.subsidies_id = s.subsidies_id
            JOIN house h ON sh.house_id = h.house_id
            JOIN grama_sevaka g ON sh.grama_sevaka_id = g.grama_sevaka_id
            WHERE s.flood_id = ?
            ORDER BY sh.subsidy_house_id DESC
        `, [floodId]);

        res.status(200).json({
            success: true,
            message: subsidies.length > 0 ? "Subsidies found for the flood" : "No subsidies found for this flood",
            data: {
                subsidies: subsidies,
                floodId: floodId
            }
        });

    } catch (error) {
        logger.error("Get all subsidies for flood error:", error);
        next(errorHandler(500, "Failed to get subsidies for the flood"));
    }
};