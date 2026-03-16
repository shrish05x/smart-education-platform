const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  website: { type: String },
  location: { type: String },
  industry: { type: String }
});

module.exports = mongoose.model('Company', companySchema);