const express = require('express');
const router = express.Router();
const {
  getCompanies,
  getCompanyById
} = require('./company.controller');

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

module.exports = router;