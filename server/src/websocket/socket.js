const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const GroupMessage = require('../models/GroupMessage');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join personal room for notifications
    socket.join(socket.userId);

    // ── Mentor-Student chat ──────────────────────────────────────────────────
    socket.on('join:mentorship', (sessionId) => {
      socket.join(`mentorship:${sessionId}`);
    });

    socket.on('message:mentorship', (data) => {
      io.to(`mentorship:${data.sessionId}`).emit('message:mentorship', {
        senderId: socket.userId,
        content: data.content,
        timestamp: new Date(),
      });
    });

    // ── Community chat ───────────────────────────────────────────────────────
    socket.on('join:community', (channelId) => {
      socket.join(`community:${channelId}`);
    });

    socket.on('message:community', (data) => {
      io.to(`community:${data.channelId}`).emit('message:community', {
        senderId: socket.userId,
        content: data.content,
        timestamp: new Date(),
      });
    });

    // ── Study Group Chat ─────────────────────────────────────────────────────

    // Join a study group room
    socket.on('join-room', async ({ groupId, userId, userName }) => {
      socket.join(`group:${groupId}`);
      socket.groupId = groupId;
      socket.userName = userName || 'Someone';

      // Broadcast user-joined to room (excluding sender)
      socket.to(`group:${groupId}`).emit('user-joined', { userName: socket.userName });
      console.log(`${userName} joined group room: ${groupId}`);
    });

    // Leave a study group room
    socket.on('leave-room', ({ groupId, userId }) => {
      socket.leave(`group:${groupId}`);
      socket.to(`group:${groupId}`).emit('user-left', { userName: socket.userName });
    });

    // Send a message to the group
    socket.on('send-message', async (data) => {
      try {
        const { groupId, content, senderName, senderAvatar, type } = data;

        if (!content || content.trim() === '') return;
        if (content.length > 1000) return;

        const message = await GroupMessage.create({
          groupId,
          senderId: socket.userId,
          senderName: senderName || 'Unknown',
          senderAvatar: senderAvatar || '',
          content: content.trim(),
          type: type || 'text',
        });

        const messageObj = {
          _id: message._id,
          groupId,
          senderId: socket.userId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        };

        // Broadcast to all in the group room (including sender)
        io.to(`group:${groupId}`).emit('receive-message', messageObj);
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    });

    // Typing indicator
    socket.on('typing', ({ groupId, userName }) => {
      socket.to(`group:${groupId}`).emit('user-typing', { userName });
    });

    socket.on('stop-typing', ({ groupId }) => {
      socket.to(`group:${groupId}`).emit('stop-typing');
    });

    // ── Live notifications ───────────────────────────────────────────────────
    socket.on('notification:send', (data) => {
      io.to(data.recipientId).emit('notification:receive', {
        ...data,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      if (socket.groupId) {
        socket.to(`group:${socket.groupId}`).emit('user-left', { userName: socket.userName });
      }
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
