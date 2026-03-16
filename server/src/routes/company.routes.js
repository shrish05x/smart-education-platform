const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

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

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

module.exports = router;