import { Server } from "socket.io";
import { Server as HttpServer } from "http";

const socketSetup = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONT_END_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { userNickname, userID } = socket.handshake.query;

    socket.on("join project room", ({ projectId }) => {
      const room = `project:${projectId}`;
      const roomInfo = io.sockets.adapter.rooms.get(room);
      const numberOfUsers = roomInfo ? roomInfo.size : 0;

      if (numberOfUsers >= 5) {
        socket.emit("room full", {
          message: "방 인원 수가 초과되어 입장할 수 없습니다.",
        });
        return;
      }

      socket.join(room);
      socket.data.projectId = projectId;

      socket.to(room).emit("sync domino request", {
        requesterId: socket.id,
      });

      socket.to(room).emit("user joined", {
        message: `${userNickname}님이 방에 입장했습니다.`,
      });
    });

    socket.on(
      "update cursor position",
      ({ projectId, objectInfo, position, selectedColor, rotationY }) => {
        const room = `project:${projectId}`;
        socket.to(room).emit("cursor position update", {
          userNickname,
          objectInfo,
          position,
          userID,
          selectedColor,
          rotationY,
        });
      },
    );

    socket.on("update domino", ({ projectId }) => {
      const room = `project:${projectId}`;
      socket.to(room).emit("domino update", {
        userNickname,
      });
    });

    socket.on("clear cursor", ({ projectId }) => {
      socket.to(`project:${projectId}`).emit("other cursor clear", { userID });
    });

    socket.on("clear domino", ({ projectId }) => {
      socket.to(`project:${projectId}`).emit("domino cleared", { projectId });
    });

    socket.on("reset domino", ({ projectId, senderId }) => {
      io.to(`project:${projectId}`).emit("reset domino", {
        senderId,
      });
    });

    socket.on("disconnect", () => {
      const projectId = socket.data.projectId;
      if (projectId) {
        const room = `project:${projectId}`;
        io.to(room).emit("user left", {
          message: `${userNickname}님이 방을 떠났습니다.`,
          userID,
        });
      }
    });
  });
};

export default socketSetup;
