import http from "http";

import { Server } from "socket.io";

const socketSetup = (app) => {
  const server = http.createServer(app);

  const serverOptions = {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  };

  const io = new Server(server, serverOptions);

  io.on("connection", (socket) => {
    socket.on("join project room", ({ projectId }) => {
      const userId = socket.handshake.query.userId;
      const room = `project:${projectId}`;
      socket.join(room);

      io.to(room).emit("user joined", {
        message: `${userId}님이 방에 입장했습니다.`,
      });
    });

    socket.on("update cursor position", ({ projectId, objectInfo, position }) => {
      const userId = socket.handshake.query.userId;
      const room = `project:${projectId}`;

      io.to(room).emit("cursor position update", { userId, objectInfo, position });
    });

    socket.on("update domino", ({ projectId, dominos }) => {
      const userId = socket.handshake.query.userId;
      const room = `project:${projectId}`;

      io.to(room).emit("domino update", { userId, dominos });
    });
  });
};

export default socketSetup;
