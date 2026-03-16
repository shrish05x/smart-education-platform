const Resource = require('../models/Resource');
const path = require('path');
const fs = require('fs');

// @desc    Get all resources (with search, filter, sort, pagination)
// @route   GET /api/resources
const getResources = async (req, res) => {
  try {
    const { search, subject, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    // Search by title or description (case-insensitive regex)
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { description: regex }];
    }

    // Filter by subject
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    // Determine sort order
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'az') sortOption = { title: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [resources, total] = await Promise.all([
      Resource.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Resource.countDocuments(query),
    ]);

    res.json({
      resources,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
const createResource = async (req, res) => {
  try {
    const { title, description, subject, resourceType, fileURL, noteContent, uploadedBy } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required' });
    }
    if (!resourceType || !['pdf', 'note', 'link'].includes(resourceType)) {
      return res.status(400).json({ message: 'Valid resource type is required (pdf, note, or link)' });
    }

    const resourceData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      subject: subject.trim(),
      resourceType,
      uploadedBy: uploadedBy || (req.user ? req.user.name : 'Anonymous'),
    };

    // Handle different resource types
    if (resourceType === 'pdf') {
      if (!req.file) {
        return res.status(400).json({ message: 'PDF file is required for PDF resource type' });
      }
      // Build the URL relative to the server
      resourceData.fileURL = `/uploads/resources/${req.file.filename}`;
    } else if (resourceType === 'note') {
      if (!noteContent || !noteContent.trim()) {
        return res.status(400).json({ message: 'Note content is required for Note resource type' });
      }
      // Save note content as a .md file
      const uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'resources');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filename = `note-${Date.now()}-${Math.round(Math.random() * 1e9)}.md`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, noteContent.trim(), 'utf8');
      resourceData.fileURL = `/uploads/resources/${filename}`;
      resourceData.noteContent = noteContent.trim();
    } else if (resourceType === 'link') {
      if (!fileURL || !fileURL.trim()) {
        return res.status(400).json({ message: 'URL is required for Link resource type' });
      }
      resourceData.fileURL = fileURL.trim();
    }

    const resource = await Resource.create(resourceData);
    res.status(201).json(resource);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a resource by ID
// @route   DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Delete associated file if it's a local upload
    if (resource.fileURL && resource.fileURL.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', resource.fileURL);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subject counts for filter badges
// @route   GET /api/resources/subjects/counts
const getSubjectCounts = async (req, res) => {
  try {
    const counts = await Resource.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const total = counts.reduce((sum, item) => sum + item.count, 0);
    const result = [{ _id: 'All', count: total }, ...counts];

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  deleteResource,
  getSubjectCounts,
};
