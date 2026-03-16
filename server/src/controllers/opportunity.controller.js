const OpportunityService = require('../services/opportunity.service');

// @desc    Get aggregated opportunities from external APIs
// @route   GET /api/opportunities
// @access  Public (or Protected depending on requirements)
const getOpportunities = async (req, res) => {
  try {
    const { type, location, skill } = req.query;

    const opportunities = await OpportunityService.getOpportunities({
      type,
      location,
      skill
    });

    // We can slice to a reasonable limit, e.g., 50
    res.json(opportunities.slice(0, 50));
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching opportunities' });
  }
};

module.exports = {
  getOpportunities
};
