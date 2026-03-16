const Company = require('./company.model');

// @desc    Get all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get company by ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCompanies,
  getCompanyById
};