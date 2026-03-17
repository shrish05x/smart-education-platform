const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

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

    // Mentor-Student chat
    socket.on('join:mentorship', (sessionId) => {
      socket.join(`mentorship:${sessionId}`);
      console.log(`User ${socket.userId} joined mentorship room: ${sessionId}`);
    });

    socket.on('message:mentorship', (data) => {
      io.to(`mentorship:${data.sessionId}`).emit('message:mentorship', {
        senderId: socket.userId,
        content: data.content,
        timestamp: new Date(),
      });
    });

    // Community chat
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

    // Study group chat
    socket.on('join:studygroup', (groupId) => {
      socket.join(`studygroup:${groupId}`);
    });

    socket.on('message:studygroup', (data) => {
      io.to(`studygroup:${data.groupId}`).emit('message:studygroup', {
        senderId: socket.userId,
        content: data.content,
        timestamp: new Date(),
      });
    });

    // Live notifications
    socket.on('notification:send', (data) => {
      io.to(data.recipientId).emit('notification:receive', {
        ...data,
        timestamp: new Date(),
      });
    });

    // Video Call Signaling
    socket.on('join:video-call', (sessionId) => {
      socket.join(`video-call:${sessionId}`);
      console.log(`User ${socket.userId} joined video call room: ${sessionId}`);
    });

    socket.on('video-call:offer', (data) => {
      socket.to(`video-call:${data.sessionId}`).emit('video-call:offer', {
        offer: data.offer,
        senderId: socket.userId,
      });
    });

    socket.on('video-call:answer', (data) => {
      socket.to(`video-call:${data.sessionId}`).emit('video-call:answer', {
        answer: data.answer,
        senderId: socket.userId,
      });
    });

    socket.on('video-call:ice-candidate', (data) => {
      socket.to(`video-call:${data.sessionId}`).emit('video-call:ice-candidate', {
        candidate: data.candidate,
        senderId: socket.userId,
      });
    });

    socket.on('video-call:end', (data) => {
      socket.to(`video-call:${data.sessionId}`).emit('video-call:end', {
        senderId: socket.userId,
      });
    });

    socket.on('disconnect', () => {
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
