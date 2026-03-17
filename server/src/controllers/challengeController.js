const WeeklyChallenge = require('../models/WeeklyChallenge');
const { awardPoints } = require('../services/gamificationService');

// GET /api/challenges
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await WeeklyChallenge.find().sort({ startDate: -1 }).limit(20);
    res.json({ success: true, data: challenges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/challenges/active
exports.getActiveChallenge = async (req, res) => {
  try {
    const now = new Date();
    const challenge = await WeeklyChallenge.findOne({ startDate: { $lte: now }, endDate: { $gte: now } }).sort({ startDate: -1 });
    res.json({ success: true, data: challenge });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/challenges/:id/submit
exports.submitChallenge = async (req, res) => {
  try {
    const challenge = await WeeklyChallenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });

    const now = new Date();
    if (now > challenge.endDate) return res.status(400).json({ success: false, message: 'Challenge deadline has passed' });

    // Check if already submitted
    const already = challenge.submissions.find((s) => s.userId.toString() === req.user._id.toString());
    if (already) return res.status(409).json({ success: false, message: 'You have already submitted' });

    const { answer, link } = req.body;
    if (!answer && !link) return res.status(400).json({ success: false, message: 'Provide an answer or submission link' });

    challenge.submissions.push({ userId: req.user._id, answer, link, submittedAt: new Date(), score: challenge.points });
    await challenge.save();

    const newBadges = await awardPoints(req.user._id, 'complete_challenge');
    res.json({ success: true, message: `Challenge submitted! +${challenge.points} points earned.`, newBadges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
