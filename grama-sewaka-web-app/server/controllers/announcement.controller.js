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

//helper function to get table configuration based on user type
const getTableConfig = (userType) => {
  const configs = {
    admin: {
      table: 'admin_announcement',
      idField: 'admin_announcement_id',
      titleField: 'admin_announcement_title',
      descriptionField: 'admin_announcement_description',
      dateField: 'admin_announcement_date',
      userIdField: 'admin_id'
    },
    government_officer: {
      table: 'government_officer_announcement',
      idField: 'government_officer_announcement_id',
      titleField: 'government_officer_announcement_title',
      descriptionField: 'government_officer_announcement_description',
      dateField: 'government_officer_announcement_date',
      userIdField: 'government_officer_id'
    },
    grama_sevaka: {
      table: 'grama_sevaka_announcement',
      idField: 'grama_sevaka_announcement_id',
      titleField: 'grama_sevaka_announcement_title',
      descriptionField: 'grama_sevaka_announcement_description',
      dateField: 'grama_sevaka_announcement_date',
      userIdField: 'grama_sevaka_id'
    }
  };
  
  return configs[userType];
};

//create new announcement
export const createAnnouncement = async (req, res, next) => {
  logger.info(`createAnnouncement called with userType=${req.params.userType}, body=${JSON.stringify(req.body)}`);
  const { userType } = req.params;
  const { title, description, emergency_level, user_id } = req.body;

  try {
    const config = getTableConfig(userType);
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be one of: admin, government_officer, grama_sevaka' 
      });
    }

    //validate required fields
    if (!title || !description || !emergency_level || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, emergency_level, user_id'
      });
    }

    //get current flood ID
    const floodId = await getCurrentOrLatestFloodId();
    if (!floodId) {
      return res.status(400).json({
        success: false,
        message: 'No active or available flood found'
      });
    }

    //insert announcement
    const insertQuery = `
      INSERT INTO ${config.table} 
      (${config.titleField}, ${config.descriptionField}, emergency_level, ${config.dateField}, ${config.userIdField}, flood_id)
      VALUES (?, ?, ?, CURDATE(), ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      title.trim(),
      description.trim(),
      emergency_level.trim(),
      user_id,
      floodId
    ]);

    logger.info(`Announcement created: id=${result.insertId}, userType=${userType}, floodId=${floodId}`);
    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: {
        id: result.insertId,
        flood_id: floodId,
        user_type: userType
      }
    });

  } catch (error) {
    logger.error(`Error creating ${userType} announcement:`, error);
    next(error);
  }
};

//get all announcements for current flood
export const getAnnouncements = async (req, res, next) => {
  logger.info(`getAnnouncements called with userType=${req.params.userType}, query=${JSON.stringify(req.query)}`);
  const { userType } = req.params;
  const { flood_id, limit = 50, offset = 0 } = req.query;

  try {
    const config = getTableConfig(userType);
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be one of: admin, government_officer, grama_sevaka' 
      });
    }

    //use provided flood_id or get current flood ID
    const floodId = flood_id || await getCurrentOrLatestFloodId();
    if (!floodId) {
      return res.status(400).json({
        success: false,
        message: 'No active or available flood found'
      });
    }

    //select announcements for the flood with pagination
    const selectQuery = `
      SELECT 
        ${config.idField} as id,
        ${config.titleField} as title,
        ${config.descriptionField} as description,
        emergency_level,
        ${config.dateField} as announcement_date,
        ${config.userIdField} as user_id,
        flood_id
      FROM ${config.table}
      WHERE flood_id = ?
      ORDER BY ${config.dateField} DESC, ${config.idField} DESC
      LIMIT ? OFFSET ?
    `;

    const [announcements] = await pool.query(selectQuery, [
      floodId, 
      parseInt(limit), 
      parseInt(offset)
    ]);

    //get total count
    const countQuery = `SELECT COUNT(*) as total FROM ${config.table} WHERE flood_id = ?`;
    const [countResult] = await pool.query(countQuery, [floodId]);

    res.json({
      success: true,
      data: announcements,
      pagination: {
        total: countResult[0].total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: countResult[0].total > (parseInt(offset) + announcements.length)
      },
      flood_id: floodId,
      user_type: userType
    });

  } catch (error) {
    logger.error(`Error fetching ${userType} announcements:`, error);
    next(error);
  }
};

//get specific announcement by ID
export const getAnnouncementById = async (req, res, next) => {
  logger.info(`getAnnouncementById called with userType=${req.params.userType}, id=${req.params.id}`);
  const { userType, id } = req.params;

  try {
    const config = getTableConfig(userType);
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be one of: admin, government_officer, grama_sevaka' 
      });
    }

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }

    const selectQuery = `
      SELECT 
        ${config.idField} as id,
        ${config.titleField} as title,
        ${config.descriptionField} as description,
        emergency_level,
        ${config.dateField} as announcement_date,
        ${config.userIdField} as user_id,
        flood_id
      FROM ${config.table}
      WHERE ${config.idField} = ?
    `;

    const [announcements] = await pool.query(selectQuery, [parseInt(id)]);

    if (announcements.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    res.json({
      success: true,
      data: announcements[0],
      user_type: userType
    });

  } catch (error) {
    logger.error(`Error fetching ${userType} announcement:`, error);
    next(error);
  }
};

//update announcement
export const updateAnnouncement = async (req, res, next) => {
  logger.info(`updateAnnouncement called with userType=${req.params.userType}, id=${req.params.id}, body=${JSON.stringify(req.body)}`);
  const { userType, id } = req.params;
  const { title, description, emergency_level } = req.body;

  try {
    const config = getTableConfig(userType);
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be one of: admin, government_officer, grama_sevaka' 
      });
    }

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }

    //check if announcement exists
    const checkQuery = `SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`;
    const [existing] = await pool.query(checkQuery, [parseInt(id)]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Only update fields provided by the user, and always update the date
    const fields = [];
    const values = [];
    if (title !== undefined) {
      fields.push(`${config.titleField} = ?`);
      values.push(title.trim());
    }
    if (description !== undefined) {
      fields.push(`${config.descriptionField} = ?`);
      values.push(description.trim());
    }
    if (emergency_level !== undefined) {
      fields.push(`emergency_level = ?`);
      values.push(emergency_level.trim());
    }
    // Always update the date
    fields.push(`${config.dateField} = CURDATE()`);
    // If no updatable fields provided, return error
    if (fields.length === 1) { // Only date is being updated
      return res.status(400).json({
        success: false,
        message: 'No updatable fields provided'
      });
    }
    const updateQuery = `
      UPDATE ${config.table}
      SET ${fields.join(', ')}
      WHERE ${config.idField} = ?
    `;
    values.push(parseInt(id));
    await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Announcement updated successfully',
      user_type: userType
    });

  } catch (error) {
    logger.error(`Error updating ${userType} announcement:`, error);
    next(error);
  }
};

//delete announcement
export const deleteAnnouncement = async (req, res, next) => {
  logger.info(`deleteAnnouncement called with userType=${req.params.userType}, id=${req.params.id}`);
  const { userType, id } = req.params;

  try {
    const config = getTableConfig(userType);
    if (!config) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user type. Must be one of: admin, government_officer, grama_sevaka' 
      });
    }

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement ID'
      });
    }

    //check if announcement exists
    const checkQuery = `SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`;
    const [existing] = await pool.query(checkQuery, [parseInt(id)]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    //delete announcement
    const deleteQuery = `DELETE FROM ${config.table} WHERE ${config.idField} = ?`;
    await pool.query(deleteQuery, [parseInt(id)]);

    res.json({
      success: true,
      message: 'Announcement deleted successfully',
      user_type: userType
    });

  } catch (error) {
    logger.error(`Error deleting ${userType} announcement:`, error);
    next(error);
  }
};