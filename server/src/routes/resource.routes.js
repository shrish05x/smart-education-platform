const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  deleteResource,
  getSubjectCounts,
} = require('../controllers/resource.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/resourceUpload');

// All routes require authentication
router.use(protect);

// Subject counts must come before /:id to avoid route conflict
router.get('/subjects/counts', getSubjectCounts);

router.get('/', getResources);
router.get('/:id', getResourceById);

// Upload middleware handles PDF file; for note/link, no file is sent
router.post('/', upload.single('file'), (err, req, res, next) => {
  // Handle Multer errors
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 10MB limit' });
    }
    return res.status(400).json({ message: err.message });
  }
  next();
}, createResource);

router.delete('/:id', deleteResource);

module.exports = router;
