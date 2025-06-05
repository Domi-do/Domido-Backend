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

dominosRouter.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { deleteDominoId, dominos } = req.body;

    if (deleteDominoId) {
      const deleteResult = await Domino.deleteOne({ _id: deleteDominoId, projectId });

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "삭제할 도미노를 찾을 수 없습니다." });
      }

      const dominosAfterDelete = await Domino.find({ projectId }).lean();
      return res.status(200).json(dominosAfterDelete);
    }

    if (!Array.isArray(dominos)) {
      return res.status(400).json({ message: "유효하지 않은 요청입니다." });
    }

    if (dominos.length === 0) {
      const deleteResult = await Domino.deleteMany({ projectId });

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ message: "삭제할 도미노가 없습니다." });
      }

      return res.status(200).json([]);
    }

    const newDominos = dominos.filter((item) => !item._id).map((item) => ({ ...item, projectId }));

    if (newDominos.length > 0) {
      await Domino.insertMany(newDominos);
    }

    const finalDominos = await Domino.find({ projectId }).lean();
    return res.status(200).json(finalDominos);
  } catch (error) {
    console.error("도미노 처리 중 에러 발생", error);
    return res.status(500).json({ message: "서버 에러로 도미노 작업을 처리하지 못했습니다." });
  }
});

export default dominosRouter;
