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
            needs,
            images // Array of image paths (handled separately)
        } = req.body;

        // Get member's house_id
        const [memberRows] = await pool.query(
            "SELECT house_id FROM member WHERE member_id = ?",
            [req.user.member_id]
        );

        if (!memberRows.length) {
            return next(errorHandler(404, "Member not found"));
        }

        const houseId = memberRows[0].house_id;

        // Check if user or user's house has already placed a request for current flood
        const [existingRequests] = await pool.query(`
            SELECT vr.victim_request_status 
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            WHERE vr.flood_id = ? AND (vr.member_id = ? OR m.house_id = ?)
            ORDER BY vr.victim_request_date DESC
            LIMIT 1
        `, [currentFloodId, req.user.member_id, houseId]);

        // Check if there's an existing request with 'reject' status
        if (existingRequests.length > 0 && existingRequests[0].victim_request_status === 'reject') {
            return next(errorHandler(403, "Cannot place request. Previous request was rejected."));
        }

        // Check if there's already a pending or approved request
        const hasPending = existingRequests.some(
            req => req.victim_request_status === 'pending' || req.victim_request_status === 'approved'
        );

        if (hasPending) {
            return next(errorHandler(400, "You already have a pending or approved request for this flood event"));
        }

        // Insert the main request
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

        // Handle image uploads if any
        if (images && images.length > 0) {
            await Promise.all(
                images.map(imagePath => 
                    pool.query(
                        `INSERT INTO victim_request_image 
                         (victim_request_id, image_path)
                         VALUES (?, ?)`,
                        [result.insertId, imagePath]
                    )
                )
            );
        }

        res.status(201).json({
            success: true,
            message: "Request submitted successfully",
            requestId: result.insertId
        });

    } catch (error) {
        logger.error("Create victim request error:", error);
        next(errorHandler(500, "Failed to submit request"));
    }
};

// Get request history
export const getVictimRequests = async (req, res, next) => {
    try {
        const currentFloodId = await getCurrentFloodId();
        
        // Get user's house ID
        const [user] = await pool.query(
            `SELECT house_id FROM member WHERE member_id = ?`,
            [req.user.member_id]
        );

        if (!user.length) {
            return next(errorHandler(404, "User not found"));
        }

        const houseId = user[0].house_id;

        // First query: Get requests for current flood by member or house
        const [currentFloodRequests] = await pool.query(`
            SELECT vr.*, m.first_name, m.last_name, m.member_phone_number
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            WHERE vr.flood_id = ? AND (vr.member_id = ? OR m.house_id = ?)
            ORDER BY vr.victim_request_date DESC
        `, [currentFloodId, req.user.member_id, houseId]);

        // Second query: Get all requests for the house across all floods
        const [allHouseRequests] = await pool.query(`
            SELECT vr.*, m.first_name, m.last_name, m.member_phone_number, f.flood_name, f.start_date, f.end_date
            FROM victim_request vr
            JOIN member m ON vr.member_id = m.member_id
            JOIN flood f ON vr.flood_id = f.flood_id
            WHERE m.house_id = ?
            ORDER BY vr.victim_request_date DESC
        `, [houseId]);

        // Get images for all requests
        const requestIds = [...new Set([
            ...currentFloodRequests.map(req => req.victim_request_id),
            ...allHouseRequests.map(req => req.victim_request_id)
        ])];

        let images = [];
        if (requestIds.length > 0) {
            const placeholders = requestIds.map(() => '?').join(',');
            const [imageRows] = await pool.query(`
                SELECT * FROM victim_request_image 
                WHERE victim_request_id IN (${placeholders})
            `, requestIds);
            images = imageRows;
        }

        // Attach images to requests
        const attachImages = (requests) => {
            return requests.map(request => ({
                ...request,
                images: images.filter(img => img.victim_request_id === request.victim_request_id)
            }));
        };

        res.status(200).json({
            success: true,
            data: {
                currentFloodRequests: attachImages(currentFloodRequests),
                allHouseRequests: attachImages(allHouseRequests),
                currentFloodId: currentFloodId
            }
        });

    } catch (error) {
        logger.error("Get victim requests error:", error);
        next(errorHandler(500, "Failed to get requests"));
    }
};

// Upload images for victim request
const uploadRequestImages = async (req, res) => {
    try {
        const { victim_request_id } = req.params;
        const images = req.files; // Assuming you're using multer or similar

        if (!images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images provided'
            });
        }

        // Verify request exists
        const [requestRows] = await db.execute(
            "SELECT victim_request_id FROM victim_request WHERE victim_request_id = ?",
            [victim_request_id]
        );

        if (requestRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Victim request not found'
            });
        }

        // Insert image records
        const imagePromises = images.map(image => 
            db.execute(
                "INSERT INTO victim_request_image (victim_request_id, image_path) VALUES (?, ?)",
                [victim_request_id, image.path]
            )
        );

        await Promise.all(imagePromises);

        res.status(200).json({
            success: true,
            message: 'Images uploaded successfully',
            data: {
                uploaded_count: images.length
            }
        });

    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

