const pool = require('../config/database');
const logger = require('../utils/logger');

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

    return latestFloods[0]?.flood_id || null;
  } catch (error) {
    logger.error("Error getting current or latest flood ID:", error);
    throw error;
  }
};

//GRAMA SEVAKA CONTROLLERS
const gramaSevaka = {
  //get pending victim requests for logged-in Grama Sevaka
  getPendingRequests: async (req, res) => {
    try {
      const gramaSevakaId = req.user.grama_sevaka_id;
      const currentFloodId = await getCurrentOrLatestFloodId();

      if (!currentFloodId) {
        return res.status(404).json({
          success: false,
          message: 'No flood data available'
        });
      }

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN grama_sevaka gs ON h.grama_niladhari_division_id = gs.grama_niladhari_division_id
        WHERE vr.flood_id = ? 
        AND vr.victim_request_status = 'pending'
        AND gs.grama_sevaka_id = ?
        ORDER BY vr.emergency_level DESC, vr.victim_request_date ASC
      `, [currentFloodId, gramaSevakaId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length,
        floodId: currentFloodId
      });

    } catch (error) {
      logger.error('Error getting pending requests for Grama Sevaka:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  //update victim request status by Grama Sevaka
  updateRequestStatus: async (req, res) => {
    try {
      const gramaSevakaId = req.user.grama_sevaka_id;
      const { victim_request_id } = req.params;
      const { status, remarks } = req.body;

      //validate status
      const validStatuses = ['approved', 'rejected', 'pending'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be: approved, rejected, or pending'
        });
      }

      //check if the request belongs to this Grama Sevaka's area
      const [checkRequest] = await pool.query(`
        SELECT vr.victim_request_id 
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN grama_sevaka gs ON h.grama_niladhari_division_id = gs.grama_niladhari_division_id
        WHERE vr.victim_request_id = ? AND gs.grama_sevaka_id = ?
      `, [victim_request_id, gramaSevakaId]);

      if (checkRequest.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this request'
        });
      }

      //update the request status
      await pool.query(`
        UPDATE victim_request 
        SET victim_request_status = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE victim_request_id = ?
      `, [status, victim_request_id]);
      
      res.json({
        success: true,
        message: `Request ${status} successfully`
      });

    } catch (error) {
      logger.error('Error updating request status by Grama Sevaka:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  //get approved victim requests for logged-in Grama Sevaka
  getApprovedRequests: async (req, res) => {
    try {
      const gramaSevakaId = req.user.grama_sevaka_id;
      const currentFloodId = await getCurrentOrLatestFloodId();

      if (!currentFloodId) {
        return res.status(404).json({
          success: false,
          message: 'No flood data available'
        });
      }

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN grama_sevaka gs ON h.grama_niladhari_division_id = gs.grama_niladhari_division_id
        WHERE vr.flood_id = ? 
        AND vr.victim_request_status = 'approved'
        AND gs.grama_sevaka_id = ?
        ORDER BY vr.victim_request_date DESC
      `, [currentFloodId, gramaSevakaId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length,
        floodId: currentFloodId
      });

    } catch (error) {
      logger.error('Error getting approved requests for Grama Sevaka:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  //get all request history for logged-in Grama Sevaka
  getRequestHistory: async (req, res) => {
    try {
      const gramaSevakaId = req.user.grama_sevaka_id;

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          f.flood_name,
          f.start_date as flood_start_date,
          f.end_date as flood_end_date,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN flood f ON vr.flood_id = f.flood_id
        JOIN grama_sevaka gs ON h.grama_niladhari_division_id = gs.grama_niladhari_division_id
        WHERE gs.grama_sevaka_id = ?
        ORDER BY vr.victim_request_date DESC
      `, [gramaSevakaId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length
      });

    } catch (error) {
      logger.error('Error getting request history for Grama Sevaka:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

//GOVERNMENT OFFICER CONTROLLERS
const governmentOfficer = {
  //get pending victim requests for logged-in Government Officer
  getPendingRequests: async (req, res) => {
    try {
      const governmentOfficerId = req.user.government_officer_id;
      const currentFloodId = await getCurrentOrLatestFloodId();

      if (!currentFloodId) {
        return res.status(404).json({
          success: false,
          message: 'No flood data available'
        });
      }

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river,
          gnd.grama_niladhari_division_name,
          ds.divisional_secretariat_name,
          d.district_name
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN grama_niladhari_division gnd ON h.grama_niladhari_division_id = gnd.grama_niladhari_division_id
        JOIN divisional_secretariat ds ON h.divisional_secretariat_id = ds.divisional_secretariat_id
        JOIN district d ON h.district_id = d.district_id
        JOIN government_officer go ON h.divisional_secretariat_id = go.divisional_secretariat_id
        WHERE vr.flood_id = ? 
        AND vr.victim_request_status = 'pending'
        AND go.government_officer_id = ?
        ORDER BY vr.emergency_level DESC, vr.victim_request_date ASC
      `, [currentFloodId, governmentOfficerId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length,
        floodId: currentFloodId
      });

    } catch (error) {
      logger.error('Error getting pending requests for Government Officer:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  //get approved victim requests for logged-in Government Officer
  getApprovedRequests: async (req, res) => {
    try {
      const governmentOfficerId = req.user.government_officer_id;
      const currentFloodId = await getCurrentOrLatestFloodId();

      if (!currentFloodId) {
        return res.status(404).json({
          success: false,
          message: 'No flood data available'
        });
      }

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river,
          gnd.grama_niladhari_division_name,
          ds.divisional_secretariat_name,
          d.district_name
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN grama_niladhari_division gnd ON h.grama_niladhari_division_id = gnd.grama_niladhari_division_id
        JOIN divisional_secretariat ds ON h.divisional_secretariat_id = ds.divisional_secretariat_id
        JOIN district d ON h.district_id = d.district_id
        JOIN government_officer go ON h.divisional_secretariat_id = go.divisional_secretariat_id
        WHERE vr.flood_id = ? 
        AND vr.victim_request_status = 'approved'
        AND go.government_officer_id = ?
        ORDER BY vr.victim_request_date DESC
      `, [currentFloodId, governmentOfficerId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length,
        floodId: currentFloodId
      });

    } catch (error) {
      logger.error('Error getting approved requests for Government Officer:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  //get all request history for logged-in Government Officer
  getRequestHistory: async (req, res) => {
    try {
      const governmentOfficerId = req.user.government_officer_id;

      const [requests] = await pool.query(`
        SELECT 
          vr.victim_request_id,
          vr.victim_request_title,
          vr.victim_request_message,
          vr.victim_request_date,
          vr.emergency_level,
          vr.needs,
          vr.victim_request_status,
          f.flood_name,
          f.start_date as flood_start_date,
          f.end_date as flood_end_date,
          m.first_name,
          m.last_name,
          m.member_phone_number,
          h.address,
          h.latitude,
          h.longitude,
          h.members as house_members,
          h.distance_to_river,
          gnd.grama_niladhari_division_name,
          ds.divisional_secretariat_name,
          d.district_name
        FROM victim_request vr
        JOIN member m ON vr.member_id = m.member_id
        JOIN house h ON m.house_id = h.house_id
        JOIN flood f ON vr.flood_id = f.flood_id
        JOIN grama_niladhari_division gnd ON h.grama_niladhari_division_id = gnd.grama_niladhari_division_id
        JOIN divisional_secretariat ds ON h.divisional_secretariat_id = ds.divisional_secretariat_id
        JOIN district d ON h.district_id = d.district_id
        JOIN government_officer go ON h.divisional_secretariat_id = go.divisional_secretariat_id
        WHERE go.government_officer_id = ?
        ORDER BY vr.victim_request_date DESC
      `, [governmentOfficerId]);

      res.json({
        success: true,
        data: requests,
        count: requests.length
      });

    } catch (error) {
      logger.error('Error getting request history for Government Officer:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};

module.exports = {
  gramaSevaka,
  governmentOfficer,
  getCurrentOrLatestFloodId
};