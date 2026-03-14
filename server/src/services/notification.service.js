const Notification = require('../models/Notification');

const createNotification = async (data) => {
  return await Notification.create(data);
};

const getUserNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: -1 });
};

const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};

const markAllAsRead = async (userId) => {
  return await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

module.exports = { createNotification, getUserNotifications, markAsRead, markAllAsRead };
