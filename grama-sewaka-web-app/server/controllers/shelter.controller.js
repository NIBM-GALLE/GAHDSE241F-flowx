import pool from '../utils/db.js';
import logger from '../utils/logger.js';

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

//create new shelter
export const createShelter = async (req, res, next) => {
    const { shelter_name, shelter_size, shelter_address, available, shelter_status, latitude, longitude } = req.body;

    try {
        //validate required fields
        if (!shelter_name || !shelter_size || !shelter_address || available === undefined || !shelter_status) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //get government officer's divisional secretariat ID
        const [officer] = await pool.query(
            'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
            [req.user.id]
        );

        if (officer.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Government officer not found"
            });
        }

        const divisionalSecretariatId = officer[0].divisional_secretariat_id;

        //insert new shelter to database (now with latitude/longitude)
        const [result] = await pool.query(
            `INSERT INTO shelter 
             (shelter_name, shelter_size, shelter_address, available, shelter_status, divisional_secretariat_id, latitude, longitude)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
            [shelter_name, shelter_size, shelter_address, available, shelter_status, divisionalSecretariatId, latitude || null, longitude || null]
        );

        res.status(201).json({
            success: true,
            message: "Shelter created successfully",
            data: {
                shelter_id: result.insertId,
                shelter_name,
                shelter_size,
                shelter_address,
                available,
                shelter_status,
                divisional_secretariat_id: divisionalSecretariatId,
                latitude,
                longitude
            }
        });

    } catch (error) {
        console.error("Create shelter error:", error);
        next(error);
    }
};

//get pending shelter requests (supports both government officer and grama sevaka roles)
export const getShelterRequests = async (req, res, next) => {
    try {
        // Determine user role and divisional_secretariat_id
        let divisionalSecretariatId;
        if (req.user.role === 'government_officer') {
            const [officer] = await pool.query(
                'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
                [req.user.id]
            );
            if (officer.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Government officer not found"
                });
            }
            divisionalSecretariatId = officer[0].divisional_secretariat_id;
        } else if (req.user.role === 'grama_sevaka') {
            const [gs] = await pool.query(
                'SELECT divisional_secretariat_id FROM grama_sevaka WHERE grama_sevaka_id = ?',
                [req.user.id]
            );
            if (gs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Grama Sevaka not found"
                });
            }
            divisionalSecretariatId = gs[0].divisional_secretariat_id;
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role"
            });
        }

        //get current flood ID
        const floodId = await getCurrentOrLatestFloodId();
        if (!floodId) {
            return res.status(200).json({
                success: true,
                message: "No active flood found",
                data: []
            });
        }

        //get pending shelter requests with house and member details
        const [requests] = await pool.query(
            `SELECT sr.*, h.address as house_address, h.members as house_members,
                    h.distance_to_river,
                    m.first_name, m.last_name, m.member_email, m.member_phone_number,
                    f.flood_name, f.start_date, f.end_date
             FROM shelter_request sr
             JOIN house h ON sr.house_id = h.house_id
             JOIN member m ON h.house_id = m.house_id
             JOIN flood f ON sr.flood_id = f.flood_id
             WHERE sr.flood_id = ? 
             AND sr.shelter_request_status = 'pending'
             AND h.divisional_secretariat_id = ?
             ORDER BY sr.emergency_level DESC, sr.shelter_request_id ASC`,
            [floodId, divisionalSecretariatId]
        );

        res.status(200).json({
            success: true,
            message: requests.length > 0 ? "Pending shelter requests found" : "No pending shelter requests",
            data: requests
        });

    } catch (error) {
        console.error("Get shelter requests error:", error);
        next(error);
    }
};

//get approved shelter requests
export const getApprovedRequests = async (req, res, next) => {
    try {
        //get government officer's divisional secretariat ID
        const [officer] = await pool.query(
            'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
            [req.user.id]
        );

        if (officer.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Government officer not found"
            });
        }

        const divisionalSecretariatId = officer[0].divisional_secretariat_id;

        //get current flood ID
        const floodId = await getCurrentOrLatestFloodId();
        if (!floodId) {
            return res.status(200).json({
                success: true,
                message: "No active flood found",
                data: []
            });
        }

        //get approved shelter requests with house and member details
        const [requests] = await pool.query(
            `SELECT sr.*, h.address as house_address, h.members as house_members,
                    h.distance_to_river,
                    m.first_name, m.last_name, m.member_email, m.member_phone_number,
                    f.flood_name, f.start_date, f.end_date,
                    s.shelter_name, s.shelter_address, s.shelter_size
             FROM shelter_request sr
             JOIN house h ON sr.house_id = h.house_id
             JOIN member m ON h.house_id = m.house_id
             JOIN flood f ON sr.flood_id = f.flood_id
             LEFT JOIN shelter_house sh ON sr.house_id = sh.house_id AND sr.flood_id = sh.flood_id
             LEFT JOIN shelter s ON sh.shelter_id = s.shelter_id
             WHERE sr.flood_id = ? 
             AND sr.shelter_request_status = 'approved'
             AND h.divisional_secretariat_id = ?
             ORDER BY sr.shelter_request_id DESC`,
            [floodId, divisionalSecretariatId]
        );

        res.status(200).json({
            success: true,
            message: requests.length > 0 ? "Approved shelter requests found" : "No approved shelter requests",
            data: requests
        });

    } catch (error) {
        console.error("Get approved requests error:", error);
        next(error);
    }
};

//get all shelters in officer's or grama sevaka's divisional secretariat
export const getShelters = async (req, res, next) => {
    try {
        let divisionalSecretariatId;
        if (req.user.role === 'government_officer') {
            const [officer] = await pool.query(
                'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
                [req.user.id]
            );
            if (officer.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Government officer not found"
                });
            }
            divisionalSecretariatId = officer[0].divisional_secretariat_id;
        } else if (req.user.role === 'grama_sevaka') {
            const [gs] = await pool.query(
                'SELECT divisional_secretariat_id FROM grama_sevaka WHERE grama_sevaka_id = ?',
                [req.user.id]
            );
            if (gs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Grama Sevaka not found"
                });
            }
            divisionalSecretariatId = gs[0].divisional_secretariat_id;
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role"
            });
        }

        //get all shelters
        const [shelters] = await pool.query(
            `SELECT s.*, ds.divisional_secretariat_name
             FROM shelter s
             JOIN divisional_secretariat ds ON s.divisional_secretariat_id = ds.divisional_secretariat_id
             WHERE s.divisional_secretariat_id = ?
             ORDER BY s.shelter_name`,
            [divisionalSecretariatId]
        );

        res.status(200).json({
            success: true,
            message: shelters.length > 0 ? "Shelters found" : "No shelters found",
            data: shelters
        });

    } catch (error) {
        console.error("Get shelters error:", error);
        next(error);
    }
};

//update shelter
export const updateShelter = async (req, res, next) => {
    const { shelter_id } = req.params;
    const { shelter_name, shelter_size, shelter_address, available, shelter_status, latitude, longitude } = req.body;

    try {
        //get government officer's divisional secretariat ID
        const [officer] = await pool.query(
            'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
            [req.user.id]
        );

        if (officer.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Government officer not found"
            });
        }

        const divisionalSecretariatId = officer[0].divisional_secretariat_id;

        //check if shelter exists and belongs to officer's divisional secretariat
        const [existingShelter] = await pool.query(
            'SELECT * FROM shelter WHERE shelter_id = ? AND divisional_secretariat_id = ?',
            [shelter_id, divisionalSecretariatId]
        );

        if (existingShelter.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shelter not found or unauthorized"
            });
        }

        //build dynamic update query
        const updateFields = [];
        const updateParams = [];
        if (shelter_name !== undefined) {
            updateFields.push('shelter_name = ?');
            updateParams.push(shelter_name);
        }
        if (shelter_size !== undefined) {
            updateFields.push('shelter_size = ?');
            updateParams.push(shelter_size);
        }
        if (shelter_address !== undefined) {
            updateFields.push('shelter_address = ?');
            updateParams.push(shelter_address);
        }
        if (available !== undefined) {
            updateFields.push('available = ?');
            updateParams.push(available);
        }
        if (shelter_status !== undefined) {
            updateFields.push('shelter_status = ?');
            updateParams.push(shelter_status);
        }
        if (latitude !== undefined) {
            updateFields.push('latitude = ?');
            updateParams.push(latitude);
        }
        if (longitude !== undefined) {
            updateFields.push('longitude = ?');
            updateParams.push(longitude);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        updateParams.push(shelter_id, divisionalSecretariatId);

        const updateQuery = `
            UPDATE shelter 
            SET ${updateFields.join(', ')}
            WHERE shelter_id = ? AND divisional_secretariat_id = ?`;

        const [result] = await pool.query(updateQuery, updateParams);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                success: false,
                message: "Failed to update shelter"
            });
        }

        res.status(200).json({
            success: true,
            message: "Shelter updated successfully",
            data: {
                shelter_id: parseInt(shelter_id),
                ...(shelter_name !== undefined && { shelter_name }),
                ...(shelter_size !== undefined && { shelter_size }),
                ...(shelter_address !== undefined && { shelter_address }),
                ...(available !== undefined && { available }),
                ...(shelter_status !== undefined && { shelter_status }),
                ...(latitude !== undefined && { latitude }),
                ...(longitude !== undefined && { longitude })
            }
        });

    } catch (error) {
        console.error("Update shelter error:", error);
        next(error);
    }
};

//approve shelter request and assign to shelter
export const approveShelterRequest = async (req, res, next) => {
    const { shelter_request_id } = req.params;
    const { shelter_id } = req.body;

    try {
        // Determine user role and divisional_secretariat_id
        let divisionalSecretariatId;
        if (req.user.role === 'government_officer') {
            const [officer] = await pool.query(
                'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
                [req.user.id]
            );
            if (officer.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Government officer not found"
                });
            }
            divisionalSecretariatId = officer[0].divisional_secretariat_id;
        } else if (req.user.role === 'grama_sevaka') {
            const [gs] = await pool.query(
                'SELECT divisional_secretariat_id FROM grama_sevaka WHERE grama_sevaka_id = ?',
                [req.user.id]
            );
            if (gs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Grama Sevaka not found"
                });
            }
            divisionalSecretariatId = gs[0].divisional_secretariat_id;
        } else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role"
            });
        }

        //check if shelter request exists and is pending
        const [request] = await pool.query(
            `SELECT sr.*, h.divisional_secretariat_id
             FROM shelter_request sr
             JOIN house h ON sr.house_id = h.house_id
             WHERE sr.shelter_request_id = ? 
             AND sr.shelter_request_status = 'pending'
             AND h.divisional_secretariat_id = ?`,
            [shelter_request_id, divisionalSecretariatId]
        );

        if (request.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shelter request not found or unauthorized"
            });
        }

        const shelterRequest = request[0];

        //check if shelter exists and has availability
        const [shelter] = await pool.query(
            'SELECT * FROM shelter WHERE shelter_id = ? AND divisional_secretariat_id = ?',
            [shelter_id, divisionalSecretariatId]
        );

        if (shelter.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shelter not found or unauthorized"
            });
        }

        if (shelter[0].available <= 0) {
            return res.status(400).json({
                success: false,
                message: "Shelter is not available"
            });
        }

        //start transaction
        await pool.query('START TRANSACTION');

        try {
            //update shelter request status to approved
            await pool.query(
                'UPDATE shelter_request SET shelter_request_status = ? WHERE shelter_request_id = ?',
                ['approved', shelter_request_id]
            );

            //insert into shelter_house table
            await pool.query(
                'INSERT INTO shelter_house (shelter_id, house_id, flood_id) VALUES (?, ?, ?)',
                [shelter_id, shelterRequest.house_id, shelterRequest.flood_id]
            );

            //update shelter availability
            await pool.query(
                'UPDATE shelter SET available = available - 1 WHERE shelter_id = ?',
                [shelter_id]
            );

            //commit transaction
            await pool.query('COMMIT');

            res.status(200).json({
                success: true,
                message: "Shelter request approved and shelter assigned successfully",
                data: {
                    shelter_request_id: parseInt(shelter_request_id),
                    shelter_id: parseInt(shelter_id),
                    house_id: shelterRequest.house_id,
                    flood_id: shelterRequest.flood_id,
                    status: 'approved'
                }
            });

        } catch (transactionError) {
            //rollback transaction
            await pool.query('ROLLBACK');
            throw transactionError;
        }

    } catch (error) {
        console.error("Approve shelter request error:", error);
        next(error);
    }
};

// Update shelter request status (e.g., reject)
export const updateShelterRequestStatus = async (req, res, next) => {
    const { shelter_request_id } = req.params;
    const { status } = req.body;
    try {
        if (!status || !["rejected", "pending", "review"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing status"
            });
        }
        // Only allow update if request exists and is pending
        const [request] = await pool.query(
            `SELECT * FROM shelter_request WHERE shelter_request_id = ? AND shelter_request_status = 'pending'`,
            [shelter_request_id]
        );
        if (request.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Shelter request not found or not pending"
            });
        }
        await pool.query(
            `UPDATE shelter_request SET shelter_request_status = ? WHERE shelter_request_id = ?`,
            [status, shelter_request_id]
        );
        res.status(200).json({
            success: true,
            message: `Shelter request status updated to ${status}`,
            data: { shelter_request_id, status }
        });
    } catch (error) {
        console.error("Update shelter request status error:", error);
        next(error);
    }
};

//get pending shelter requests for Grama Sevaka
export const getShelterRequestsByGS = async (req, res, next) => {
    try {
        //get grama sevaka's division
        const [gs] = await pool.query(
            'SELECT grama_niladhari_division_id FROM grama_sevaka WHERE grama_sevaka_id = ?',
            [req.user.id]
        );
        if (gs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Grama Sevaka not found"
            });
        }
        const divisionId = gs[0].grama_niladhari_division_id;
        //get current flood ID
        const floodId = await getCurrentOrLatestFloodId();
        if (!floodId) {
            return res.status(200).json({
                success: true,
                message: "No active flood found",
                data: []
            });
        }
        //get pending shelter requests for this GS's division
        const [requests] = await pool.query(
            `SELECT sr.*, h.address as house_address, h.members as house_members,
                    h.distance_to_river,
                    m.first_name, m.last_name, m.member_email, m.member_phone_number,
                    f.flood_name, f.start_date, f.end_date
             FROM shelter_request sr
             JOIN house h ON sr.house_id = h.house_id
             JOIN member m ON h.house_id = m.house_id
             JOIN flood f ON sr.flood_id = f.flood_id
             WHERE sr.flood_id = ? 
             AND sr.shelter_request_status = 'pending'
             AND h.grama_niladhari_division_id = ?
             ORDER BY sr.emergency_level DESC, sr.shelter_request_id ASC`,
            [floodId, divisionId]
        );
        res.status(200).json({
            success: true,
            message: requests.length > 0 ? "Pending shelter requests found" : "No pending shelter requests",
            data: requests
        });
    } catch (error) {
        console.error("Get GS shelter requests error:", error);
        next(error);
    }
};

//get approved shelter requests for Grama Sevaka
export const getApprovedRequestsByGS = async (req, res, next) => {
    try {
        //get grama sevaka's division
        const [gs] = await pool.query(
            'SELECT grama_niladhari_division_id FROM grama_sevaka WHERE grama_sevaka_id = ?',
            [req.user.id]
        );
        if (gs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Grama Sevaka not found"
            });
        }
        const divisionId = gs[0].grama_niladhari_division_id;
        //get current flood ID
        const floodId = await getCurrentOrLatestFloodId();
        if (!floodId) {
            return res.status(200).json({
                success: true,
                message: "No active flood found",
                data: []
            });
        }
        //get approved shelter requests for this GS's division
        const [requests] = await pool.query(
            `SELECT sr.*, h.address as house_address, h.members as house_members,
                    h.distance_to_river,
                    m.first_name, m.last_name, m.member_email, m.member_phone_number,
                    f.flood_name, f.start_date, f.end_date,
                    s.shelter_name, s.shelter_address, s.shelter_size
             FROM shelter_request sr
             JOIN house h ON sr.house_id = h.house_id
             JOIN member m ON h.house_id = m.house_id
             JOIN flood f ON sr.flood_id = f.flood_id
             LEFT JOIN shelter_house sh ON sr.house_id = sh.house_id AND sr.flood_id = sh.flood_id
             LEFT JOIN shelter s ON sh.shelter_id = s.shelter_id
             WHERE sr.flood_id = ? 
             AND sr.shelter_request_status = 'approved'
             AND h.grama_niladhari_division_id = ?
             ORDER BY sr.shelter_request_id DESC`,
            [floodId, divisionId]
        );
        res.status(200).json({
            success: true,
            message: requests.length > 0 ? "Approved shelter requests found" : "No approved shelter requests",
            data: requests
        });
    } catch (error) {
        console.error("Get GS approved requests error:", error);
        next(error);
    }
};

