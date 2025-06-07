import pool from '../utils/db.js';
import logger from '../utils/logger.js';

//function to get current or latest flood ID
const getCurrentOrLatestFloodId = async () => {
  try {
    // Get current active flood
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

//insert new subsidy request and update subsidy quantity
export const createSubsidyRequest = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      house_id, 
      subsidies_id, 
      category, 
      quantity, 
      collection_place 
    } = req.body;
    
    const grama_sevaka_id = req.user.grama_sevaka_id;

    //check if subsidy exists and has enough quantity
    const [subsidyCheck] = await connection.query(
      'SELECT current_quantity, subsidies_status FROM subsidies WHERE subsidies_id = ?',
      [subsidies_id]
    );

    if (subsidyCheck.length === 0) {
      return res.status(404).json({ error: 'Subsidy not found' });
    }

    if (subsidyCheck[0].subsidies_status !== 'active') {
      return res.status(400).json({ error: 'Subsidy is not active' });
    }

    if (subsidyCheck[0].current_quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient subsidy quantity available' });
    }

    //insert subsidy request
    const [result] = await connection.query(
      `INSERT INTO subsidy_house 
       (category, quantity, collection_place, subsidies_status, house_id, subsidies_id, grama_sevaka_id) 
       VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
      [category, quantity, collection_place, house_id, subsidies_id, grama_sevaka_id]
    );

    //update current quantity in subsidies table
    await connection.query(
      'UPDATE subsidies SET current_quantity = current_quantity - ? WHERE subsidies_id = ?',
      [quantity, subsidies_id]
    );

    await connection.commit();
    
    res.status(201).json({
      message: 'Subsidy request created successfully',
      subsidy_house_id: result.insertId
    });

  } catch (error) {
    await connection.rollback();
    logger.error('Error creating subsidy request:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

//view all subsidy requests for Grama Sevaka
export const getSubsidyRequestsByGramaSevaka = async (req, res) => {
  try {
    const grama_sevaka_id = req.user.grama_sevaka_id;
    
    const [requests] = await pool.query(
      `SELECT 
        sh.*,
        h.address as house_address,
        s.subsidy_name,
        s.category as subsidy_category,
        f.flood_name
      FROM subsidy_house sh
      JOIN house h ON sh.house_id = h.house_id
      JOIN subsidies s ON sh.subsidies_id = s.subsidies_id
      JOIN flood f ON s.flood_id = f.flood_id
      WHERE sh.grama_sevaka_id = ?
      ORDER BY sh.subsidy_house_id DESC`,
      [grama_sevaka_id]
    );

    res.json({
      message: 'Subsidy requests retrieved successfully',
      requests
    });

  } catch (error) {
    logger.error('Error getting subsidy requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update subsidy request status
export const updateSubsidyRequestStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { subsidy_house_id } = req.params;
    const { subsidies_status } = req.body;
    // DEBUG: Log user object for troubleshooting
    logger.info('updateSubsidyRequestStatus: req.user', req.user);
    console.log('updateSubsidyRequestStatus: req.user =', JSON.stringify(req.user));
    const grama_sevaka_id = req.user.grama_sevaka_id || req.user.id;

    //validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'distributed'];
    if (!validStatuses.includes(subsidies_status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    //check if the request belongs to this Grama Sevaka
    const [existingRequest] = await connection.query(
      'SELECT * FROM subsidy_house WHERE subsidy_house_id = ? AND grama_sevaka_id = ?',
      [subsidy_house_id, grama_sevaka_id]
    );

    if (existingRequest.length === 0) {
      return res.status(404).json({ error: 'Subsidy request not found or access denied' });
    }

    const oldStatus = existingRequest[0].subsidies_status;

    //if changing from approved/distributed back to rejected, restore quantity
    if ((oldStatus === 'approved' || oldStatus === 'distributed') && subsidies_status === 'rejected') {
      await connection.query(
        'UPDATE subsidies SET current_quantity = current_quantity + ? WHERE subsidies_id = ?',
        [existingRequest[0].quantity, existingRequest[0].subsidies_id]
      );
    }

    //update status
    await connection.query(
      'UPDATE subsidy_house SET subsidies_status = ? WHERE subsidy_house_id = ?',
      [subsidies_status, subsidy_house_id]
    );

    await connection.commit();

    res.json({
      message: 'Subsidy request status updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    logger.error('Error updating subsidy request status:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
};

//view all subsidies for current flood
export const getSubsidiesForCurrentFlood = async (req, res) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    
    if (!currentFloodId) {
      return res.status(404).json({ error: 'No active or recent flood found' });
    }

    const [subsidies] = await pool.query(
      `SELECT 
        s.*,
        f.flood_name,
        f.flood_status
      FROM subsidies s
      JOIN flood f ON s.flood_id = f.flood_id
      WHERE s.flood_id = ?
      ORDER BY s.subsidies_id DESC`,
      [currentFloodId]
    );

    res.json({
      message: 'Subsidies retrieved successfully',
      flood_id: currentFloodId,
      subsidies
    });

  } catch (error) {
    logger.error('Error getting subsidies for current flood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//insert new subsidy
export const createSubsidy = async (req, res) => {
  try {
    const {
      subsidy_name,
      category,
      quantity,
      subsidies_status = 'active'
    } = req.body;

    const currentFloodId = await getCurrentOrLatestFloodId();
    
    if (!currentFloodId) {
      return res.status(404).json({ error: 'No active or recent flood found' });
    }

    const [result] = await pool.query(
      `INSERT INTO subsidies 
       (subsidy_name, category, quantity, current_quantity, subsidies_status, flood_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [subsidy_name, category, quantity, quantity, subsidies_status, currentFloodId]
    );

    res.status(201).json({
      message: 'Subsidy created successfully',
      subsidies_id: result.insertId,
      flood_id: currentFloodId
    });

  } catch (error) {
    logger.error('Error creating subsidy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//view all subsidies for current flood
export const getSubsidiesForCurrentFloodGO = async (req, res) => {
  try {
    const currentFloodId = await getCurrentOrLatestFloodId();
    
    if (!currentFloodId) {
      return res.status(404).json({ error: 'No active or recent flood found' });
    }

    const [subsidies] = await pool.query(
      `SELECT 
        s.*,
        f.flood_name,
        f.flood_status,
        f.start_date,
        f.end_date
      FROM subsidies s
      JOIN flood f ON s.flood_id = f.flood_id
      WHERE s.flood_id = ?
      ORDER BY s.subsidies_id DESC`,
      [currentFloodId]
    );

    res.json({
      message: 'Subsidies retrieved successfully',
      flood_id: currentFloodId,
      subsidies
    });

  } catch (error) {
    logger.error('Error getting subsidies for current flood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//view all subsidy requests in Government Officer's Divisional Secretariat for current flood
export const getSubsidyRequestsByDivisionalSecretariat = async (req, res) => {
  try {
    const government_officer_id = req.user.government_officer_id;
    const currentFloodId = await getCurrentOrLatestFloodId();
    
    if (!currentFloodId) {
      return res.status(404).json({ error: 'No active or recent flood found' });
    }

    //get Government Officer's divisional secretariat
    const [officerInfo] = await pool.query(
      'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
      [government_officer_id]
    );

    if (officerInfo.length === 0) {
      return res.status(404).json({ error: 'Government officer not found' });
    }

    const divisional_secretariat_id = officerInfo[0].divisional_secretariat_id;

    const [requests] = await pool.query(
      `SELECT 
        sh.*,
        h.address as house_address,
        h.house_id,
        s.subsidy_name,
        s.category as subsidy_category,
        f.flood_name,
        gs.first_name as grama_sevaka_first_name,
        gs.last_name as grama_sevaka_last_name,
        gnd.grama_niladhari_division_name,
        ds.divisional_secretariat_name
      FROM subsidy_house sh
      JOIN house h ON sh.house_id = h.house_id
      JOIN subsidies s ON sh.subsidies_id = s.subsidies_id
      JOIN flood f ON s.flood_id = f.flood_id
      JOIN grama_sevaka gs ON sh.grama_sevaka_id = gs.grama_sevaka_id
      JOIN grama_niladhari_division gnd ON h.grama_niladhari_division_id = gnd.grama_niladhari_division_id
      JOIN divisional_secretariat ds ON h.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE h.divisional_secretariat_id = ? AND s.flood_id = ?
      ORDER BY sh.subsidy_house_id DESC`,
      [divisional_secretariat_id, currentFloodId]
    );

    res.json({
      message: 'Subsidy requests retrieved successfully',
      flood_id: currentFloodId,
      divisional_secretariat_id,
      requests
    });

  } catch (error) {
    logger.error('Error getting subsidy requests by divisional secretariat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update subsidy
export const updateSubsidy = async (req, res) => {
  try {
    const { subsidy_id } = req.params;
    const { subsidy_name, category, quantity, subsidies_status } = req.body;

    //get current subsidy
    const [rows] = await pool.query('SELECT subsidy_name, category, quantity, current_quantity, subsidies_status FROM subsidies WHERE subsidies_id = ?', [subsidy_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Subsidy not found' });
    }
    const old = rows[0];

    //use new value if provided, else old value
    const newSubsidyName = subsidy_name !== undefined ? subsidy_name : old.subsidy_name;
    const newCategory = category !== undefined ? category : old.category;
    const newStatus = subsidies_status !== undefined ? subsidies_status : old.subsidies_status;
    let newQuantity = old.quantity;
    let newCurrentQuantity = old.current_quantity;

    //only update quantity if provided
    if (quantity !== undefined) {
      newQuantity = Number(quantity);
      //if new quantity < current_quantity, reject
      if (newQuantity < old.current_quantity) {
        return res.status(400).json({ error: 'New quantity cannot be less than current available quantity' });
      }
      //calculate new current_quantity
      const quantityDiff = newQuantity - old.quantity;
      newCurrentQuantity = old.current_quantity + quantityDiff;
    }

    await pool.query(
      'UPDATE subsidies SET subsidy_name = ?, category = ?, quantity = ?, current_quantity = ?, subsidies_status = ? WHERE subsidies_id = ?',
      [newSubsidyName, newCategory, newQuantity, newCurrentQuantity, newStatus, subsidy_id]
    );

    res.json({ message: 'Subsidy updated successfully' });
  } catch (error) {
    logger.error('Error updating subsidy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};