import express from "express";

import { DominoModel } from "../Models/DominosSchema.js";

const dominosRouter = express.Router();

dominosRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const dominos = await DominoModel.find({ projectId }).lean();

    return res.status(200).json(dominos);
  } catch (error) {
    console.error("도미노 조회 중 에러 발생", error);
    return res.status(500).json({ message: "서버 에러로 데이터를 불러오지 못했습니다." });
  }
});

dominosRouter.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dominos } = req.body;

    if (!Array.isArray(dominos)) {
      return res.status(400).json({ message: "유효하지 않은 요청입니다." });
    }

    await DominoModel.deleteMany({ projectId });

    if (dominos.length === 0) {
      return res.status(200).json([]);
    }

    const newDominos = dominos.map((item) => ({
      ...item,
      projectId,
    }));

    await DominoModel.insertMany(newDominos);

    const finalDominos = await DominoModel.find({ projectId }).lean();
    return res.status(200).json(finalDominos);
  } catch (error) {
    console.error("도미노 처리 중 에러 발생:", error);
    return res.status(500).json({ message: "서버 에러로 도미노 작업을 처리하지 못했습니다." });
  }
});

export default dominosRouter;
