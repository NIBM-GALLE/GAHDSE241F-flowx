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

        //check subsidies table where house_id = logged user house and flood_id = current/latest flood and status = pending
        const [subsidies] = await pool.query(`
            SELECT s.*, gs.grama_sevaka_name, gs.grama_sevaka_phone_number, 
                   f.flood_name, f.start_date, f.end_date,
                   h.address as house_address
            FROM subsidies s
            LEFT JOIN grama_sevaka gs ON s.grama_sevaka_id = gs.grama_sevaka_id
            LEFT JOIN flood f ON s.flood_id = f.flood_id
            LEFT JOIN house h ON s.house_id = h.house_id
            WHERE s.house_id = ? AND s.flood_id = ? AND s.subsidies_status = 'pending'
            ORDER BY s.subsidies_id DESC
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
        logger.error("Get new subsidies error:", error);
        next(errorHandler(500, "Failed to get new subsidies"));
    }
};

//funtion to get subsidies history (collected subsidies)
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

        //select all subsidies where house_id = user's house and status = collected
        const [subsidiesHistory] = await pool.query(`
            SELECT s.*, gs.grama_sevaka_name, gs.grama_sevaka_phone_number,
                   f.flood_name, f.start_date, f.end_date,
                   h.address as house_address
            FROM subsidies s
            LEFT JOIN grama_sevaka gs ON s.grama_sevaka_id = gs.grama_sevaka_id
            LEFT JOIN flood f ON s.flood_id = f.flood_id
            LEFT JOIN house h ON s.house_id = h.house_id
            WHERE s.house_id = ? AND s.subsidies_status = 'collected'
            ORDER BY s.subsidies_id DESC
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