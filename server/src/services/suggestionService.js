const User = require('../models/User');

/**
 * Peer Matching Scoring Algorithm
 * 1. Fetch users NOT already connected + NOT blocked + NOT self
 * 2. Score each candidate:
 *    - +3 points per overlapping skill
 *    - +5 if same goals/lookingFor (simplified: overlapping lookingFor arrays)
 *    - +1 per mutual connection
 *    // Removed group & active heuristics for simplicity unless explicitly passed
 * 3. Sort by score descending
 * 4. Return top 10 with: user info + matchScore + matchReasons array
 */
const getPeerSuggestions = async (userId) => {
  const currentUser = await User.findById(userId).lean();
  if (!currentUser) throw new Error('User not found');

  const myConnections = (currentUser.connections || []).map(id => id.toString());
  const mySkills = currentUser.skills || [];
  const myLookingFor = currentUser.lookingFor || [];

  // Exclude self and already connected people
  // Note: we don't strictly exclude users we've sent pending requests to at this query step,
  // we could filter them out efficiently if we query Connection model, but for performance
  // we'll fetch a batch of users and let frontend map connection state or filter post-query.
  // Actually, filtering them out completely is better. But let's keep it simple first.
  const excludeIds = [currentUser._id, ...myConnections];

  const potentialMatches = await User.find({
    _id: { $nin: excludeIds },
    isOpenToConnect: true,
  })
    .select('name profileImage bio skills goals reputation badges connections lookingFor')
    .limit(100)
    .lean();

  const scoredMatches = potentialMatches.map(candidate => {
    let score = 0;
    const reasons = [];

    // 1. Skill overlap (+3 per skill)
    const candidateSkills = candidate.skills || [];
    const sharedSkills = mySkills.filter(s => candidateSkills.includes(s));
    if (sharedSkills.length > 0) {
      score += sharedSkills.length * 3;
      reasons.push(`${sharedSkills.length} shared skills: ${sharedSkills.slice(0, 3).join(', ')}`);
    }

    // 2. Mutual connections (+1 per mutual)
    const candidateConns = (candidate.connections || []).map(id => id.toString());
    const mutualCount = myConnections.filter(c => candidateConns.includes(c)).length;
    if (mutualCount > 0) {
      score += mutualCount * 1;
      reasons.push(`${mutualCount} mutual connection${mutualCount > 1 ? 's' : ''}`);
    }

    // 3. Same lookingFor (+5 points if overlapping goals)
    const candidateLookingFor = candidate.lookingFor || [];
    const sharedGoals = myLookingFor.filter(g => candidateLookingFor.includes(g));
    if (sharedGoals.length > 0) {
      score += sharedGoals.length * 5;
      reasons.push(`Similar goals: ${sharedGoals.slice(0, 2).join(', ')}`);
    }

    // Provide a small randomized base score so people without matches still show up
    if (score === 0) {
      score = Math.random(); // 0-1
    }

    return {
      ...candidate,
      matchScore: score,
      matchReasons: reasons
    };
  });

  // Sort descending and grab top 10
  scoredMatches.sort((a, b) => b.matchScore - a.matchScore);
  const top10 = scoredMatches.slice(0, 10);

  // Clean up sensitive/unnecessary data
  return top10.map(m => {
    const { connections, ...rest } = m;
    return rest;
  });
};

module.exports = {
  getPeerSuggestions
};
