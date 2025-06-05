import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import dominosRouter from "./routes/dominos.js";
import projectsRouter from "./routes/projects.js";

dotenv.config();

const PORT = process.env.EXPRESS_PORT;

const app = express();

await connectDB();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/projects", projectsRouter);
app.use("/dominos", dominosRouter);

app.listen(PORT, () => {
  console.log(`✅ App listening on port ${PORT}`);
});
