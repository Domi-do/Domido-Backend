import http from "http";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import dominosRouter from "./routes/dominos.js";
import projectsRouter from "./routes/projects.js";
import authRouter from "./routes/user.js";
import socketSetup from "./config/socket.js";

dotenv.config();

const PORT = process.env.EXPRESS_PORT;
const app = express();
const server = http.createServer(app);

await connectDB();
socketSetup(server);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/projects", projectsRouter);
app.use("/dominos", dominosRouter);
app.use("/auth", authRouter);

server.listen(PORT, () => {
  console.log(`App + Socket.IO listening on port ${PORT}`);
});
