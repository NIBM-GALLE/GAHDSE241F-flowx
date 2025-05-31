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