import { Server } from "socket.io";

const socketSetup = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { userNickname, userID } = socket.handshake.query;

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
        userID,
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
