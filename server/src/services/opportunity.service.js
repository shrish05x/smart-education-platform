const axios = require('axios');

/**
 * Service to fetch opportunities from external APIs
 * Normalizes them into:
 * { title, company, type, description, location, skillsRequired, salary, deadline, sourcePlatform, applyUrl }
 */
class OpportunityService {
  
  // Normalize Remotive API (Jobs, Part-time, remote internships)
  static async fetchRemotiveJobs(category = '', search = '') {
    try {
      // Remotive is a free API. category can be 'software-dev', 'data', etc.
      let url = 'https://remotive.com/api/remote-jobs?limit=20';
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;

      const response = await axios.get(url);
      const jobs = response.data.jobs || [];

      return jobs.map(job => {
        // Map job type to our standard types
        let type = 'job';
        if (job.job_type === 'contract') type = 'part-time';
        if (job.title.toLowerCase().includes('intern')) type = 'internship';

        return {
          title: job.title,
          company: job.company_name,
          type: type,
          description: job.description, // HTML description
          location: job.candidate_required_location || 'Remote',
          skillsRequired: job.tags || [],
          salary: job.salary || 'Not specified',
          deadline: job.publication_date, // publish date instead of deadline
          sourcePlatform: 'Remotive',
          applyUrl: job.url
        };
      });
    } catch (error) {
      console.error('Error fetching from Remotive:', error.message);
      return [];
    }
  }

  // Normalize GitHub API query for Hackathons
  static async fetchGitHubHackathons(search = 'hackathon') {
    try {
      // GitHub API to search repos related to hackathons, treating them as mock hackathon entries.
      const response = await axios.get(`https://api.github.com/search/repositories?q=${search}+topic:hackathon&sort=updated&per_page=10`);
      const repos = response.data.items || [];

      return repos.map(repo => {
        return {
          title: repo.name.replace(/-/g, ' '),
          company: repo.owner.login,
          type: 'hackathon',
          description: repo.description || 'A hackathon project/repository',
          location: 'Online',
          skillsRequired: repo.topics || [],
          salary: 'N/A',
          deadline: repo.pushed_at, // Mocking deadline as last pushed date
          sourcePlatform: 'GitHub',
          applyUrl: repo.html_url
        };
      });
    } catch (error) {
      console.error('Error fetching from GitHub API:', error.message);
      return [];
    }
  }

  // Fetch from BuiltIn, Jooble, Adzuna or mock if no keys
  static async fetchAdzunaJobs(search = '', location = '') {
    // Requires App ID and App Key. Mocking functionality if keys not present.
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      // Return empty if keys aren't set, so it gracefully falls back to other APIs
      return [];
    }

    try {
      const response = await axios.get(`http://api.adzuna.com/v1/api/jobs/us/search/1`, {
        params: {
          app_id: appId,
          app_key: appKey,
          results_per_page: 20,
          what: search,
          where: location
        }
      });
      const jobs = response.data.results || [];
      return jobs.map(job => {
        let type = 'job';
        if (job.contract_type === 'part_time') type = 'part-time';
        if (job.title.toLowerCase().includes('intern')) type = 'internship';

        return {
          title: job.title,
          company: job.company.display_name,
          type: type,
          description: job.description,
          location: job.location.display_name,
          skillsRequired: [], // Adzuna doesn't explicitly give skills list
          salary: job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : 'Not specified',
          deadline: job.created, 
          sourcePlatform: 'Adzuna',
          applyUrl: job.redirect_url
        };
      });
    } catch (error) {
      console.error('Error fetching from Adzuna:', error.message);
      return [];
    }
  }

  /**
   * Main aggregator method
   */
  static async getOpportunities({ type, location, skill }) {
    // Start parallel fetches
    const fetchPromises = [];

    // Base search query combining skill or default developer search
    let searchQuery = skill || 'developer';
    
    // Explicitly modify search to guarantee results for specific types if skill isn't provided
    if (type === 'internship' && !skill) searchQuery = 'intern';
    if (type === 'part-time' && !skill) searchQuery = 'part time';
    if (type === 'hackathon' && !skill) searchQuery = 'hackathon';

    // If type is hackathon, only fetch hackathons
    if (type === 'hackathon') {
      fetchPromises.push(this.fetchGitHubHackathons(searchQuery));
    } 
    // If type is internship, job, part-time or all
    else {
      // Fetch jobs (Remotive + Adzuna)
      fetchPromises.push(this.fetchRemotiveJobs('', searchQuery));
      fetchPromises.push(this.fetchAdzunaJobs(searchQuery, location));

      // Also fetch hackathons if type is not specified (get all types)
      if (!type) {
        fetchPromises.push(this.fetchGitHubHackathons(searchQuery));
      }
    }

    // Wait for all APIs to respond
    const results = await Promise.allSettled(fetchPromises);

    // Combine successful results
    let combined = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        combined = [...combined, ...result.value];
      }
    });

    // Apply filtering on the aggregated list
    if (type) {
      combined = combined.filter(item => item.type === type);
    }
    if (location) {
      const locLower = location.toLowerCase();
      combined = combined.filter(item => item.location.toLowerCase().includes(locLower));
    }

    return combined;
  }
}

module.exports = OpportunityService;
