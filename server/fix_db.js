const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    
    // Remove documents with user: null in MentorProfile
    const MentorProfile = require('./src/models/MentorProfile');
    const result = await MentorProfile.deleteMany({ user: null });
    console.log(`Removed ${result.deletedCount} MentorProfile documents with user: null`);
    
    // It might be StudentProfile or CounselorProfile getting created accidentally?
    // Let's drop indexes for all of them just in case they have user_1
    const models = ['MentorProfile', 'StudentProfile', 'CounselorProfile'];
    for (const modelName of models) {
      const Model = require(`./src/models/${modelName}`);
      try {
        await Model.collection.dropIndexes();
        console.log(`Dropped indexes for ${modelName}`);
        await Model.syncIndexes();
        console.log(`Synced indexes for ${modelName}`);
      } catch (e) {
        console.log(`Could not drop indexes for ${modelName}:`, e.message);
      }
    }
  } catch(err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

fixDatabase();
