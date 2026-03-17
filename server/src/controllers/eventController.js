const Event = require('../models/Event');
const User = require('../models/User');
const { awardPoints } = require('../services/gamificationService');

// GET /api/events
exports.getEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    const events = await Event.find(query)
      .sort({ startDate: 1 })
      .populate('host', 'name profileImage');
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('host', 'name profileImage')
      .populate('registrations', 'name profileImage');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events
exports.createEvent = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate, maxParticipants, prize } = req.body;
    if (!title || !type || !startDate || !endDate)
      return res.status(400).json({ success: false, message: 'Title, type, startDate, and endDate are required' });

    const event = await Event.create({
      title, description, type, host: req.user._id,
      startDate: new Date(startDate), endDate: new Date(endDate),
      maxParticipants: maxParticipants || 100,
      prize: prize || '',
    });
    const populated = await Event.findById(event._id).populate('host', 'name profileImage');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/register
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.status === 'completed')
      return res.status(400).json({ success: false, message: 'This event has completed' });
    if (event.registrations.includes(req.user._id))
      return res.status(409).json({ success: false, message: 'Already registered' });
    if (event.registrations.length >= event.maxParticipants)
      return res.status(400).json({ success: false, message: 'Event is full' });

    event.registrations.push(req.user._id);
    await event.save();
    await awardPoints(req.user._id, 'join_event');

    res.json({ success: true, data: { registrationCount: event.registrations.length } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
