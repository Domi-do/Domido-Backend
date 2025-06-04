import express from "express";

import dominosSchema from "../Models/DominosSchema.js";

const dominosRouter = express.Router();

dominosRouter.get("/", async (req, res) => {
  try {
    const data = await dominosSchema.find();
    res.status(200).send(data);
  } catch (error) {
    console.error("데이터를 가져오는 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 데이터를 불러오지 못했습니다." });
  }
});

export default dominosRouter;
