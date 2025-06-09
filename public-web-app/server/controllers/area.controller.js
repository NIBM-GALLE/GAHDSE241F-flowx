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

export const getDistrictNameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [districts] = await pool.query('SELECT district_name as name FROM district WHERE district_id = ?', [id]);
    if (districts.length === 0) {
      return res.status(404).json({ success: false, message: 'District not found' });
    }
    res.status(200).json({ success: true, name: districts[0].name });
  } catch (error) {
    console.error('Error in getDistrictNameById:', error);
    next(error);
  }
};

export const getDivisionalSecretariatNameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [secretariats] = await pool.query('SELECT divisional_secretariat_name as name FROM divisional_secretariat WHERE divisional_secretariat_id = ?', [id]);
    if (secretariats.length === 0) {
      return res.status(404).json({ success: false, message: 'Divisional Secretariat not found' });
    }
    res.status(200).json({ success: true, name: secretariats[0].name });
  } catch (error) {
    console.error('Error in getDivisionalSecretariatNameById:', error);
    next(error);
  }
};

export const getGramaNiladhariDivisionNameById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [divisions] = await pool.query('SELECT grama_niladhari_division_name as name FROM grama_niladhari_division WHERE grama_niladhari_division_id = ?', [id]);
    if (divisions.length === 0) {
      return res.status(404).json({ success: false, message: 'Grama Niladhari Division not found' });
    }
    res.status(200).json({ success: true, name: divisions[0].name });
  } catch (error) {
    console.error('Error in getGramaNiladhariDivisionNameById:', error);
    next(error);
  }
};