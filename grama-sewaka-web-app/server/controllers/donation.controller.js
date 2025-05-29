import pool from '../config/db.js';
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

    return latestFloods[0]?.flood_id || null;
  } catch (error) {
    logger.error("Error getting current or latest flood ID:", error);
    throw error;
  }
};

//display new donation requests
export const getNewDonationRequests = async (req, res) => {
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

    //get new donation requests
    const [donations] = await pool.query(
      `SELECT 
        d.*,
        f.flood_name,
        f.flood_status,
        ds.divisional_secretariat_name
      FROM donations d
      JOIN flood f ON d.flood_id = f.flood_id
      JOIN divisional_secretariat ds ON d.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE d.donations_status = 'new' 
        AND d.flood_id = ? 
        AND d.divisional_secretariat_id = ?
      ORDER BY d.donations_id DESC`,
      [currentFloodId, divisional_secretariat_id]
    );

    res.json({
      message: 'New donation requests retrieved successfully',
      flood_id: currentFloodId,
      divisional_secretariat_id,
      count: donations.length,
      donations
    });

  } catch (error) {
    logger.error('Error getting new donation requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//display pending donation requests
export const getPendingDonationRequests = async (req, res) => {
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

    //get pending donation requests
    const [donations] = await pool.query(
      `SELECT 
        d.*,
        f.flood_name,
        f.flood_status,
        ds.divisional_secretariat_name
      FROM donations d
      JOIN flood f ON d.flood_id = f.flood_id
      JOIN divisional_secretariat ds ON d.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE d.donations_status = 'pending' 
        AND d.flood_id = ? 
        AND d.divisional_secretariat_id = ?
      ORDER BY d.donations_id DESC`,
      [currentFloodId, divisional_secretariat_id]
    );

    res.json({
      message: 'Pending donation requests retrieved successfully',
      flood_id: currentFloodId,
      divisional_secretariat_id,
      count: donations.length,
      donations
    });

  } catch (error) {
    logger.error('Error getting pending donation requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//display donation history (collected donations)
export const getDonationHistory = async (req, res) => {
  try {
    const government_officer_id = req.user.government_officer_id;

    //get Government Officer's divisional secretariat
    const [officerInfo] = await pool.query(
      'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
      [government_officer_id]
    );

    if (officerInfo.length === 0) {
      return res.status(404).json({ error: 'Government officer not found' });
    }

    const divisional_secretariat_id = officerInfo[0].divisional_secretariat_id;

    //get collected donation history (all floods)
    const [donations] = await pool.query(
      `SELECT 
        d.*,
        f.flood_name,
        f.flood_status,
        f.start_date,
        f.end_date,
        ds.divisional_secretariat_name
      FROM donations d
      JOIN flood f ON d.flood_id = f.flood_id
      JOIN divisional_secretariat ds ON d.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE d.donations_status = 'collected' 
        AND d.divisional_secretariat_id = ?
      ORDER BY d.donations_id DESC`,
      [divisional_secretariat_id]
    );

    res.json({
      message: 'Donation history retrieved successfully',
      divisional_secretariat_id,
      count: donations.length,
      donations
    });

  } catch (error) {
    logger.error('Error getting donation history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//update donation status
export const updateDonationStatus = async (req, res) => {
  try {
    const { donations_id } = req.params;
    const { donations_status } = req.body;
    const government_officer_id = req.user.government_officer_id;

    //validate status
    const validStatuses = ['new', 'pending', 'collected', 'rejected'];
    if (!validStatuses.includes(donations_status)) {
      return res.status(400).json({ error: 'Invalid donation status' });
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

    //check if the donation belongs to this Government Officer's divisional secretariat
    const [existingDonation] = await pool.query(
      'SELECT * FROM donations WHERE donations_id = ? AND divisional_secretariat_id = ?',
      [donations_id, divisional_secretariat_id]
    );

    if (existingDonation.length === 0) {
      return res.status(404).json({ error: 'Donation not found or access denied' });
    }

    //update donation status
    const [result] = await pool.query(
      'UPDATE donations SET donations_status = ? WHERE donations_id = ?',
      [donations_status, donations_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Failed to update donation status' });
    }

    //get updated donation details
    const [updatedDonation] = await pool.query(
      `SELECT 
        d.*,
        f.flood_name,
        ds.divisional_secretariat_name
      FROM donations d
      JOIN flood f ON d.flood_id = f.flood_id
      JOIN divisional_secretariat ds ON d.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE d.donations_id = ?`,
      [donations_id]
    );

    res.json({
      message: 'Donation status updated successfully',
      donation: updatedDonation[0]
    });

  } catch (error) {
    logger.error('Error updating donation status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get donation details by ID (for viewing individual donation)
export const getDonationById = async (req, res) => {
  try {
    const { donations_id } = req.params;
    const government_officer_id = req.user.government_officer_id;

    //get Government Officer's divisional secretariat
    const [officerInfo] = await pool.query(
      'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
      [government_officer_id]
    );

    if (officerInfo.length === 0) {
      return res.status(404).json({ error: 'Government officer not found' });
    }

    const divisional_secretariat_id = officerInfo[0].divisional_secretariat_id;

    //get donation details
    const [donation] = await pool.query(
      `SELECT 
        d.*,
        f.flood_name,
        f.flood_status,
        f.start_date,
        f.end_date,
        ds.divisional_secretariat_name
      FROM donations d
      JOIN flood f ON d.flood_id = f.flood_id
      JOIN divisional_secretariat ds ON d.divisional_secretariat_id = ds.divisional_secretariat_id
      WHERE d.donations_id = ? AND d.divisional_secretariat_id = ?`,
      [donations_id, divisional_secretariat_id]
    );

    if (donation.length === 0) {
      return res.status(404).json({ error: 'Donation not found or access denied' });
    }

    res.json({
      message: 'Donation details retrieved successfully',
      donation: donation[0]
    });

  } catch (error) {
    logger.error('Error getting donation details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//get donation statistics for Government Officer's division
export const getDonationStatistics = async (req, res) => {
  try {
    const government_officer_id = req.user.government_officer_id;
    const currentFloodId = await getCurrentOrLatestFloodId();

    //get Government Officer's divisional secretariat
    const [officerInfo] = await pool.query(
      'SELECT divisional_secretariat_id FROM government_officer WHERE government_officer_id = ?',
      [government_officer_id]
    );

    if (officerInfo.length === 0) {
      return res.status(404).json({ error: 'Government officer not found' });
    }

    const divisional_secretariat_id = officerInfo[0].divisional_secretariat_id;

    //get statistics for current flood
    const [currentFloodStats] = await pool.query(
      `SELECT 
        donations_status,
        COUNT(*) as count
      FROM donations 
      WHERE divisional_secretariat_id = ? AND flood_id = ?
      GROUP BY donations_status`,
      [divisional_secretariat_id, currentFloodId]
    );

    //get overall statistics for the division
    const [overallStats] = await pool.query(
      `SELECT 
        donations_status,
        COUNT(*) as count
      FROM donations 
      WHERE divisional_secretariat_id = ?
      GROUP BY donations_status`,
      [divisional_secretariat_id]
    );

    //format statistics
    const formatStats = (stats) => {
      const formatted = {
        new: 0,
        pending: 0,
        collected: 0,
        rejected: 0,
        total: 0
      };
      
      stats.forEach(stat => {
        formatted[stat.donations_status] = stat.count;
        formatted.total += stat.count;
      });
      
      return formatted;
    };

    res.json({
      message: 'Donation statistics retrieved successfully',
      current_flood: {
        flood_id: currentFloodId,
        statistics: formatStats(currentFloodStats)
      },
      overall_statistics: formatStats(overallStats),
      divisional_secretariat_id
    });

  } catch (error) {
    logger.error('Error getting donation statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};