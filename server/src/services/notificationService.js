const Notification = require('../models/Notification');

// Global reference to Socket.io instance (set from server.js)
let io;
const setIo = (ioInstance) => { io = ioInstance; };

/**
 * Create a notification in DB and emit real-time via socket.
 */
const createNotification = async ({ recipient, sender, type, postId, commentId, connectionId, message }) => {
  // Don't notify yourself
  if (recipient && sender && recipient.toString() === sender.toString()) return null;

  const notification = await Notification.create({
    recipient, sender, type, postId, commentId, connectionId, message
  });

  // Emit real-time to the recipient's socket room
  if (io) {
    io.to(`user_${recipient}`).emit('new-notification', {
      _id: notification._id,
      type,
      message,
      postId,
      commentId,
      connectionId,
      sender,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};

module.exports = { createNotification, setIo };
