import express from "express";

import { Domino } from "../Models/DominosSchema.js";

const dominosRouter = express.Router();

dominosRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const dominos = await Domino.find({ projectId }).lean();

    return res.status(200).json(dominos);
  } catch (error) {
    console.error("도미노 조회 중 에러 발생", error);
    return res.status(500).json({ message: "서버 에러로 데이터를 불러오지 못했습니다." });
  }
});

export default dominosRouter;
