import pool from '../utils/db.js';
import logger from '../utils/logger.js';
import axios from 'axios';
import { callFlaskModel } from '../utils/flaskProxy.js';

//insert new flood
export const insertFlood = async (req, res, next) => {
  logger.info(`insertFlood called by admin_id=${req.user.id}, body=${JSON.stringify(req.body)}`);

  const {
    flood_name,
    start_date,
    end_date,
    flood_description,
    flood_status = 'ongoing'
  } = req.body;

  const admin_id = req.user.id;

  try {
    //validate required fields
    if (!flood_name || !start_date || !flood_status || !flood_description) {
      return res.status(400).json({
        success: false,
        message: "Flood name, start date, description, and flood status are required"
      });
    }
    //validate date formats
    if (isNaN(Date.parse(start_date)) || (end_date && isNaN(Date.parse(end_date)))) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD."
      });
    }

    //insert new flood
    const insertQuery = `
      INSERT INTO flood 
      (flood_name, start_date, end_date, flood_description, flood_status, admin_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [flood_name, start_date, end_date, flood_description, flood_status, admin_id];

    const [result] = await pool.query(insertQuery, insertParams);

    logger.info(`Flood created successfully: id=${result.insertId}`);
    res.status(201).json({
      success: true,
      message: "Flood created successfully",
      flood_id: result.insertId,
      data: {
        flood_id: result.insertId,
        flood_name,
        start_date,
        end_date,
        flood_status,
        flood_description,
        admin_id
      }
    });

  } catch (error) {
    logger.error("Insert flood error:", error);
    next(error);
  }
};

//insert flood details
export const insertFloodDetails = async (req, res, next) => {
  logger.info(`insertFloodDetails called by admin_id=${req.user.id}, body=${JSON.stringify(req.body)}`);

  const {
    flood_details_date,
    river_level,
    rain_fall,
    water_rising_rate,
    flood_area
  } = req.body;

  const admin_id = req.user.id;

  try {
    //check if record already exists for this date
    const checkQuery = `
      SELECT flood_details_id FROM flood_details 
      WHERE flood_details_date = ?
    `;
    const [existing] = await pool.query(checkQuery, [flood_details_date]);
    
    if (existing.length > 0) {
      logger.warn(`Flood details for date '${flood_details_date}' already exist`);
      return res.status(400).json({
        success: false,
        message: "Flood details for this date already exist. Please update the existing record."
      });
    }

    //insert new flood details
    const insertQuery = `
      INSERT INTO flood_details 
      (flood_details_date, river_level, rain_fall, water_rising_rate, flood_area, admin_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const insertParams = [
      flood_details_date, 
      river_level, 
      rain_fall, 
      water_rising_rate, 
      flood_area, 
      admin_id
    ];

    const [result] = await pool.query(insertQuery, insertParams);

    logger.info(`Flood details created successfully: id=${result.insertId}`);
    res.status(201).json({
      success: true,
      message: "Flood details created successfully",
      flood_details_id: result.insertId,
      data: {
        flood_details_id: result.insertId,
        flood_details_date,
        river_level,
        rain_fall,
        water_rising_rate,
        flood_area,
        admin_id
      }
    });

  } catch (error) {
    logger.error("Insert flood details error:", error);
    next(error);
  }
};

//update flood status
export const updateFloodStatus = async (req, res, next) => {
  logger.info(`updateFloodStatus called by admin_id=${req.user.id}, flood_id=${req.params.flood_id}, body=${JSON.stringify(req.body)}`);

  const { flood_id } = req.params;
  const { flood_status } = req.body;

  const admin_id = req.user.id;

  try {
    //check if flood exists
    const checkQuery = `
      SELECT flood_id FROM flood 
      WHERE flood_id = ?
    `;
    const [existing] = await pool.query(checkQuery, [flood_id]);
    
    if (existing.length === 0) {
      logger.warn(`Flood not found or no permission for flood_id=${flood_id}`);
      return res.status(404).json({
        success: false,
        message: "Flood not found or you don't have permission to update it"
      });
    }

    //update flood status
    const updateQuery = `
      UPDATE flood 
      SET flood_status = ?
      WHERE flood_id = ? AND admin_id = ?
    `;
    const updateParams = [flood_status, flood_id, admin_id];

    await pool.query(updateQuery, updateParams);

    logger.info(`Flood status updated successfully: flood_id=${flood_id}, status=${flood_status}`);
    res.status(200).json({
      success: true,
      message: "Flood status updated successfully",
      data: {
        flood_id: parseInt(flood_id),
        flood_status
      }
    });

  } catch (error) {
    logger.error("Update flood status error:", error);
    next(error);
  }
};

//update flood details
export const updateFloodDetails = async (req, res, next) => {
  logger.info(`updateFloodDetails called by admin_id=${req.user.id}, flood_details_id=${req.params.flood_details_id}, body=${JSON.stringify(req.body)}`);

  const { flood_details_id } = req.params;
  const {
    flood_details_date,
    river_level,
    rain_fall,
    water_rising_rate,
    flood_area
  } = req.body;

  const admin_id = req.user.id;

  try {
    //check if flood details exists
    const checkQuery = `
      SELECT flood_details_id FROM flood_details 
      WHERE flood_details_id = ?
    `;
    const [existing] = await pool.query(checkQuery, [flood_details_id]);
    
    if (existing.length === 0) {
      logger.warn(`Flood details not found flood_details_id=${flood_details_id}`);
      return res.status(404).json({
        success: false,
        message: "Flood details not found"
      });
    }
    if (flood_details_date) {
      //check if another record exists for the same date (excluding current record)
      const dateCheckQuery = `
        SELECT flood_details_id FROM flood_details 
        WHERE flood_details_date = ? AND flood_details_id != ?
      `;
      const [dateExisting] = await pool.query(dateCheckQuery, [flood_details_date, flood_details_id]);
      
      if (dateExisting.length > 0) {
        logger.warn(`Flood details for date '${flood_details_date}' already exist (update)`);
        return res.status(400).json({
          success: false,
          message: "Flood details for this date already exist"
        });
      }
    }

    //build dynamic update query
    const updateFields = [];
    const updateParams = [];

    if (flood_details_date) {
      updateFields.push('flood_details_date = ?');
      updateParams.push(flood_details_date);
    }
    if (river_level !== undefined) {
      updateFields.push('river_level = ?');
      updateParams.push(river_level);
    }
    if (rain_fall !== undefined) {
      updateFields.push('rain_fall = ?');
      updateParams.push(rain_fall);
    }
    if (water_rising_rate) {
      updateFields.push('water_rising_rate = ?');
      updateParams.push(water_rising_rate);
    }
    if (flood_area) {
      updateFields.push('flood_area = ?');
      updateParams.push(flood_area);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update"
      });
    }

    //add conditions to params
    updateParams.push(flood_details_id, admin_id);

    const updateQuery = `
      UPDATE flood_details 
      SET ${updateFields.join(', ')}
      WHERE flood_details_id = ? AND admin_id = ?
    `;

    await pool.query(updateQuery, updateParams);

    logger.info(`Flood details updated successfully: flood_details_id=${flood_details_id}`);
    res.status(200).json({
      success: true,
      message: "Flood details updated successfully",
      data: {
        flood_details_id: parseInt(flood_details_id),
        ...(flood_details_date && { flood_details_date }),
        ...(river_level !== undefined && { river_level }),
        ...(rain_fall !== undefined && { rain_fall }),
        ...(water_rising_rate && { water_rising_rate }),
        ...(flood_area && { flood_area })
      }
    });

  } catch (error) {
    logger.error("Update flood details error:", error);
    next(error);
  }
};

// Update main flood event (name, status, end_date, description)
export const updateFlood = async (req, res, next) => {
  logger.info(`updateFlood called by admin_id=${req.user.id}, flood_id=${req.params.flood_id}, body=${JSON.stringify(req.body)}`);

  const { flood_id } = req.params;
  const admin_id = req.user.id;
  const { flood_name, flood_status, end_date, flood_description } = req.body;

  try {
    // Check if flood exists
    const [existing] = await pool.query(
      `SELECT * FROM flood WHERE flood_id = ?`,
      [flood_id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: "Flood not found" });
    }
    // Build dynamic update query
    const updateFields = [];
    const updateParams = [];
    if (flood_name !== undefined) {
      updateFields.push('flood_name = ?');
      updateParams.push(flood_name);
    }
    if (flood_status !== undefined) {
      updateFields.push('flood_status = ?');
      updateParams.push(flood_status);
    }
    if (end_date !== undefined) {
      updateFields.push('end_date = ?');
      updateParams.push(end_date);
    }
    if (flood_description !== undefined) {
      updateFields.push('flood_description = ?');
      updateParams.push(flood_description);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }
    updateParams.push(flood_id);
    const updateQuery = `UPDATE flood SET ${updateFields.join(', ')} WHERE flood_id = ?`;
    await pool.query(updateQuery, updateParams);
    logger.info(`Flood updated successfully: flood_id=${flood_id}`);
    res.status(200).json({ success: true, message: "Flood updated successfully" });
  } catch (error) {
    logger.error("Update flood error:", error);
    next(error);
  }
};

//display all past floods
export const getAllFloods = async (req, res, next) => {
  logger.info(`getAllFloods called by admin_id=${req.user.id}`);

  try {
    const query = `
      SELECT * FROM flood ORDER BY start_date DESC
    `;

    const [floods] = await pool.query(query);

    logger.info(`Floods retrieved: count=${floods.length}`);
    res.status(200).json({
      success: true,
      message: "Floods retrieved successfully",
      count: floods.length,
      data: floods
    });

  } catch (error) {
    logger.error("Get all floods error:", error);
    next(error);
  }
};

// Get flood details for a specific flood or all flood details
export const getFloodDetails = async (req, res, next) => {
  logger.info(`getFloodDetails called by admin_id=${req.user.id}, query=${JSON.stringify(req.query)}`);

  const { flood_id } = req.query;

  try {
    let query = `
      SELECT * FROM flood_details`;
    let queryParams = [];

    if (flood_id) {
      query += ' WHERE flood_id = ?';
      queryParams.push(flood_id);
    }

    query += ' ORDER BY flood_details_date DESC';

    const [floodDetails] = await pool.query(query, queryParams);

    logger.info(`Flood details retrieved: count=${floodDetails.length}`);
    res.status(200).json({
      success: true,
      message: "Flood details retrieved successfully",
      count: floodDetails.length,
      data: floodDetails
    });

  } catch (error) {
    logger.error("Get flood details error:", error);
    next(error);
  }
};

// Get the current active flood event
export const getCurrentFlood = async (req, res, next) => {
  logger.info(`getCurrentFlood called by admin_id=${req.user.id}`);
  try {
    const query = `
      SELECT * FROM flood WHERE flood_status = 'active' AND CURRENT_DATE BETWEEN start_date AND IFNULL(end_date, CURRENT_DATE)
      ORDER BY start_date DESC LIMIT 1
    `;
    const [floods] = await pool.query(query);
    if (floods.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No current flood event',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Current flood event retrieved',
      data: floods[0]
    });
  } catch (error) {
    logger.error('Get current flood error:', error);
    next(error);
  }
};

// Get all past flood events (status 'over')
export const getPastFloods = async (req, res, next) => {
  logger.info(`getPastFloods called by admin_id=${req.user.id}`);
  try {
    const query = `
      SELECT * FROM flood
    `;
    const [floods] = await pool.query(query);
    res.status(200).json({
      success: true,
      message: 'Past floods retrieved',
      count: floods.length,
      data: floods
    });
  } catch (error) {
    logger.error('Get past floods error:', error);
    next(error);
  }
};

// Get the most recent flood details (current)
export const getCurrentFloodDetails = async (req, res, next) => {
  try {
    const query = `
      SELECT * FROM flood_details ORDER BY flood_details_date DESC LIMIT 1
    `;
    const [details] = await pool.query(query);
    if (details.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No current flood details',
        data: null
      });
    }
    res.status(200).json({
      success: true,
      message: 'Current flood details retrieved',
      data: details[0]
    });
  } catch (error) {
    logger.error('Get current flood details error:', error);
    next(error);
  }
};

// Get all past flood details (excluding the most recent/current)
export const getPastFloodDetails = async (req, res, next) => {
  try {
    const query = `
      SELECT * FROM flood_details ORDER BY flood_details_date DESC
    `;
    const [details] = await pool.query(query);
    if (details.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No past flood details',
        data: []
      });
    }
    // Exclude the most recent (current) detail
    res.status(200).json({
      success: true,
      message: 'Past flood details retrieved',
      data: details.slice(1)
    });
  } catch (error) {
    logger.error('Get past flood details error:', error);
    next(error);
  }
};

// Update only changed fields for flood_details
export const updateFloodDetailsFields = async (req, res, next) => {
  logger.info(`updateFloodDetailsFields called by admin_id=${req.user.id}, flood_details_id=${req.params.flood_details_id}, body=${JSON.stringify(req.body)}`);
  const { flood_details_id } = req.params;
  const {
    flood_details_date,
    river_level,
    rain_fall,
    water_rising_rate,
    flood_area
  } = req.body;
  const admin_id = req.user.id;
  try {
    // Check if flood_details exists
    const checkQuery = `SELECT * FROM flood_details WHERE flood_details_id = ?`;
    const [existing] = await pool.query(checkQuery, [flood_details_id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Flood details not found' });
    }
    // Build dynamic update query for only changed fields
    const updateFields = [];
    const updateParams = [];
    if (flood_details_date !== undefined && flood_details_date !== existing[0].flood_details_date) {
      updateFields.push('flood_details_date = ?');
      updateParams.push(flood_details_date);
    }
    if (river_level !== undefined && String(river_level) !== String(existing[0].river_level)) {
      updateFields.push('river_level = ?');
      updateParams.push(river_level);
    }
    if (rain_fall !== undefined && String(rain_fall) !== String(existing[0].rain_fall)) {
      updateFields.push('rain_fall = ?');
      updateParams.push(rain_fall);
    }
    if (water_rising_rate !== undefined && String(water_rising_rate) !== String(existing[0].water_rising_rate)) {
      updateFields.push('water_rising_rate = ?');
      updateParams.push(water_rising_rate);
    }
    if (flood_area !== undefined && String(flood_area) !== String(existing[0].flood_area)) {
      updateFields.push('flood_area = ?');
      updateParams.push(flood_area);
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }
    updateParams.push(flood_details_id, admin_id);
    const updateQuery = `UPDATE flood_details SET ${updateFields.join(', ')} WHERE flood_details_id = ? AND admin_id = ?`;
    await pool.query(updateQuery, updateParams);
    logger.info(`Flood details updated successfully: flood_details_id=${flood_details_id}`);
    res.status(200).json({
      success: true,
      message: 'Flood details updated successfully',
      data: {
        flood_details_id: parseInt(flood_details_id),
        ...(flood_details_date && { flood_details_date }),
        ...(river_level !== undefined && { river_level }),
        ...(rain_fall !== undefined && { rain_fall }),
        ...(water_rising_rate !== undefined && { water_rising_rate }),
        ...(flood_area !== undefined && { flood_area })
      }
    });
  } catch (error) {
    logger.error('Update flood details fields error:', error);
    next(error);
  }
};

// --- BEGIN: Public API for ML, user risk, and today details ---
// Get today's flood details (from flood_details table)
export const getTodayFloodDetails = async (req, res, next) => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const [details] = await pool.query(
      `SELECT * FROM flood_details WHERE flood_details_date = ? ORDER BY flood_details_id DESC LIMIT 1`,
      [today]
    );
    if (details.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No flood details found for today',
        data: null
      });
    }
    // Add month and parse numeric fields for ML
    const date = new Date(details[0].flood_details_date || details[0].date || Date.now());
    const month = date.getMonth() + 1;
    const river_level = parseFloat(details[0].river_level);
    const rain_fall = parseFloat(details[0].rain_fall);
    const water_recession_level = details[0].water_rising_rate !== undefined ? parseFloat(details[0].water_rising_rate) : null;
    const processed = {
      ...details[0],
      month,
      river_level,
      rain_fall,
      water_recession_level
    };
    res.status(200).json({
      success: true,
      message: "Today's flood details retrieved successfully",
      data: processed
    });
  } catch (error) {
    logger.error('Get today flood details error:', error);
    next(error);
  }
};

// Proxy ML prediction to Flask
export const predictFloodML = async (req, res) => {
  try {
    const { model, features } = req.body;
    if (!model || !features) {
      return res.status(400).json({ success: false, message: 'Model and features are required' });
    }
    const flaskRes = await callFlaskModel(model, features);
    res.status(200).json({ success: true, prediction: flaskRes.data.prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ML prediction failed', error: error.message });
  }
};

// Predict flood risk for a user based on distance to river and flood area
export const predictFloodRiskForUser = async (req, res, next) => {
  try {
    const { distance_to_river, flood_area } = req.body;
    if (distance_to_river === undefined || flood_area === undefined) {
      return res.status(400).json({ success: false, message: 'distance_to_river and flood_area are required' });
    }
    let riskLevel, message;
    if (distance_to_river <= flood_area) {
      riskLevel = 'danger';
      message = `Your home is within the predicted flood area (${distance_to_river} km to river, flood may reach up to ${flood_area} km). You are at risk!`;
    } else {
      const safeDistance = (distance_to_river - flood_area).toFixed(2);
      riskLevel = 'safe';
      message = `You are approximately ${safeDistance} km outside the predicted flood area. Stay alert, but you are currently safe.`;
    }
    res.status(200).json({
      success: true,
      risk: riskLevel,
      message,
      distance_to_river: parseFloat(distance_to_river),
      flood_area: parseFloat(flood_area)
    });
  } catch (error) {
    logger.error('Predict flood risk for user error:', error);
    next(error);
  }
};
