const User = require('../models/User');

// Badge thresholds
const BADGE_TIERS = [
  { name: 'Beginner', icon: '🌱', threshold: 50 },
  { name: 'Contributor', icon: '⭐', threshold: 200 },
  { name: 'Helper', icon: '🤝', threshold: 500 },
  { name: 'Expert', icon: '🏆', threshold: 1000 },
  { name: 'Legend', icon: '👑', threshold: 5000 },
  // Connection thresholds (granted based on connection counts manually)
  { name: 'Networker', icon: '🤝', connectReq: 10 },
  { name: 'Connector', icon: '🌐', connectReq: 50 },
  { name: 'Hub', icon: '💎', connectReq: 100 },
];

// Points awarded per action
const POINTS = {
  ask_question: 5,
  answer_question: 10,
  upvote_received_post: 10,
  downvote_received_post: -2,
  upvote_received_answer: 15,
  answer_accepted: 25,
  share_resource: 8,
  join_event: 5,
  complete_challenge: 30,
  send_connection: 2,
  accept_connection: 5,
};

/**
 * Award points to a user and check badge thresholds.
 * Returns newly awarded badges (if any) so the caller can emit notifications.
 */
const awardPoints = async (userId, action) => {
  const delta = POINTS[action] || 0;
  if (delta === 0) return [];

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points: delta, reputation: delta > 0 ? delta : 0 } },
    { new: true }
  );

  if (!user) return [];

  return checkAndAwardBadges(user);
};

/**
 * Check if the user has crossed any badge threshold since last award.
 * Returns array of newly awarded badge objects.
 */
const checkAndAwardBadges = async (user) => {
  const currentPoints = user.points;
  const currentConnections = user.connectionCount || 0;
  const earnedBadgeNames = user.badges.map((b) => b.name);
  const newBadges = [];

  for (const tier of BADGE_TIERS) {
    if (earnedBadgeNames.includes(tier.name)) continue;
    
    // Check points threshold
    if (tier.threshold && currentPoints >= tier.threshold) {
      const badge = { name: tier.name, icon: tier.icon, awardedAt: new Date() };
      newBadges.push(badge);
      await User.findByIdAndUpdate(user._id, { $push: { badges: badge } });
    }
    
    // Check connection threshold
    if (tier.connectReq && currentConnections >= tier.connectReq) {
      const badge = { name: tier.name, icon: tier.icon, awardedAt: new Date() };
      newBadges.push(badge);
      await User.findByIdAndUpdate(user._id, { $push: { badges: badge } });
    }
  }

  return newBadges;
};

module.exports = { awardPoints, checkAndAwardBadges, POINTS };
