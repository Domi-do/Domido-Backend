import { Server } from "socket.io";

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userNickname = socket.handshake.query.userNickname;
    console.log(`👤 ${userNickname} 연결됨 (소켓 ID: ${socket.id})`);

    socket.on("join project room", ({ projectId }) => {
      const room = `project:${projectId}`;
      socket.join(room);

      io.to(room).emit("user joined", {
        message: `${userNickname}님이 방에 입장했습니다.`,
      });
    });

    socket.on("update cursor position", ({ projectId, objectInfo, position }) => {
      const room = `project:${projectId}`;
      io.to(room).emit("cursor position update", {
        userNickname,
        objectInfo,
        position,
      });
    });

    socket.on("update domino", ({ projectId, dominos }) => {
      const room = `project:${projectId}`;
      io.to(room).emit("domino update", {
        userNickname,
        dominos,
      });
    });
  });
};

export default socketSetup;
