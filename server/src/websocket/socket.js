const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;
let waitingLounge = []; // Store socket IDs for random matching

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

    // Join personal room by ID for notifications and direct calls
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

    // Video Call Signaling (Room Code Based)
    socket.on('join:video-call', (roomCode) => {
      socket.join(roomCode);
      console.log(`User ${socket.userId} joined video call room: ${roomCode}`);
    });

    socket.on('video-call:offer', (data) => {
      // Broadcast the offer to the specific room code
      socket.to(data.roomCode).emit('video-call:offer', data.offer);
    });

    socket.on('video-call:answer', (data) => {
      // Broadcast the answer to the specific room code
      socket.to(data.roomCode).emit('video-call:answer', data.answer);
    });

    socket.on('video-call:ice-candidate', (data) => {
      // Broadcast ICE candidates to the specific room code
      socket.to(data.roomCode).emit('video-call:ice-candidate', data.candidate);
    });

    socket.on('video-call:end', (data) => {
      socket.to(`video-call:${data.sessionId}`).emit('video-call:end', {
        senderId: socket.userId,
      });
    });

    // Global Call Routing (making it ring for the other user)
    socket.on('call:initiate', (data) => {
      // Route strictly by MongoDB User ID
      io.to(data.targetId).emit('call:incoming', {
        callerId: socket.userId,
        callerName: data.callerName,
        callerAvatar: data.callerAvatar,
        offer: data.offer, // WebRTC initial offer
        sessionId: data.sessionId, // Unique ID for this call to create a room
      });
      console.log(`Initiated call to User ID ${data.targetId} from User ID ${socket.userId}`);
    });

    socket.on('call:accepted', (data) => {
      // Notify the caller that the call was accepted
      socket.to(`video-call:${data.sessionId}`).emit('call:accepted', {
        responderId: socket.userId,
        answer: data.answer // WebRTC answer
      });
    });

    socket.on('call:rejected', (data) => {
      // Route by callerId so caller knows it was rejected
      io.to(data.callerId).emit('call:rejected', {
        targetId: data.targetId,
        sessionId: data.sessionId
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
