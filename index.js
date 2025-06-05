import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import dominosRouter from "./routes/dominos.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const PORT = process.env.EXPRESS_PORT;

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/dominos", dominosRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`✅ App listening on port ${PORT}`);
});
