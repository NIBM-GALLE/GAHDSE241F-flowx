import pool from '../utils/db.js';
import logger from '../utils/logger.js';

//insert new flood
export const insertFlood = async (req, res, next) => {
  logger.info(`insertFlood called by admin_id=${req.user.id}, body=${JSON.stringify(req.body)}`);

  const {
    flood_name,
    start_date,
    end_date,
    flood_status = 'ongoing'
  } = req.body;

  const admin_id = req.user.id;

  try {
    //validate required fields
    if (!flood_name || !start_date || !flood_status) {
      return res.status(400).json({
        success: false,
        message: "Flood name, start date, and flood status are required"
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
      (flood_name, start_date, end_date, flood_status, admin_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    const insertParams = [flood_name, start_date, end_date, flood_status, admin_id];

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