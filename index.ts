import http from "http";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";
import dominosRouter from "./routes/dominos";
import projectsRouter from "./routes/projects";
import guestProjectsRouter from "./routes/guestProjects";
import guestDominoRouter from "./routes/guestDominos";
import authRouter from "./routes/user";
import socketSetup from "./config/socket";
import achievement from "./routes/achievements";

dotenv.config();

const PORT = process.env.EXPRESS_PORT;
const app = express();
const server = http.createServer(app);

await connectDB();
socketSetup(server);

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "refresh-token"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/guest/projects", guestProjectsRouter);
app.use("/projects", projectsRouter);

app.use("/dominos", dominosRouter);
app.use("/guest/dominos", guestDominoRouter);
app.use("/auth", authRouter);
app.use("/achievements", achievement);

server.listen(PORT, () => {
  console.log(`App + Socket.IO listening on port ${PORT}`);
});
