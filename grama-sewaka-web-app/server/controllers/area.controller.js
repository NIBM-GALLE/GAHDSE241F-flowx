import pool from '../utils/db.js';

export const getDistricts = async (req, res, next) => {
  try {
    const [districts] = await pool.query('SELECT * FROM district');
    res.status(200).json({
      success: true,
      data: districts
    });
  } catch (error) {
    next(error);
  }
};

export const getDivisionalSecretariats = async (req, res, next) => {
  try {
    const { district_id } = req.query;
    const [secretariats] = await pool.query(
      'SELECT * FROM divisional_secretariat WHERE district_id = ?',
      [district_id]
    );
    res.status(200).json({
      success: true,
      data: secretariats
    });
  } catch (error) {
    next(error);
  }
};

export const getGramaNiladhariDivisions = async (req, res, next) => {
  try {
    const { divisional_secretariat_id } = req.query;
    const [divisions] = await pool.query(
      'SELECT * FROM grama_niladhari_division WHERE divisional_secretariat_id = ?',
      [divisional_secretariat_id]
    );
    res.status(200).json({
      success: true,
      data: divisions
    });
  } catch (error) {
    next(error);
  }
};

// Get area name by type and id
export const getAreaNameById = async (req, res, next) => {
  try {
    const { type, id } = req.query;
    let table, idField, nameField;
    if (type === 'district') {
      table = 'district';
      idField = 'district_id';
      nameField = 'district_name';
    } else if (type === 'divisional_secretariat') {
      table = 'divisional_secretariat';
      idField = 'divisional_secretariat_id';
      nameField = 'divisional_secretariat_name';
    } else if (type === 'grama_niladhari_division') {
      table = 'grama_niladhari_division';
      idField = 'grama_niladhari_division_id';
      nameField = 'grama_niladhari_division_name';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type' });
    }
    const [rows] = await pool.query(
      `SELECT ${nameField} as name FROM ${table} WHERE ${idField} = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, name: rows[0].name });
  } catch (error) {
    next(error);
  }
};