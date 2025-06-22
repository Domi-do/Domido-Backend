import express from "express";

import { DominoModel } from "../Models/DominosSchema";
import { verifyAccessToken } from "../middlewares/authMiddleware";

const dominosRouter = express.Router();

dominosRouter.use(verifyAccessToken);

dominosRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const dominos = await DominoModel.find({ projectId }).lean();

    res.status(200).json(dominos);
    return;
  } catch (error) {
    console.error("도미노 조회 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 도미노 데이터를 불러오지 못했습니다." });
    return;
  }
});

dominosRouter.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dominos } = req.body;

    if (!Array.isArray(dominos)) {
      res.status(400).json({ message: "dominos는 배열이어야 합니다." });
      return
    }

    if (dominos.length === 0) {
      await DominoModel.deleteMany({ projectId });
      res.status(200).json([]);
      return
    }

    const databaseDominos = await DominoModel.find({ projectId }).lean();
    const clientDominoIds = dominos.map((d) => d._id).filter(Boolean);

    const deleteOps = databaseDominos
      .filter((d) => !clientDominoIds.includes(String(d._id)))
      .map((d) => ({
        deleteOne: {
          filter: { _id: d._id },
        },
      }));

    const upsertOps = dominos.map((domino) => ({
      replaceOne: {
        filter: { _id: domino._id },
        replacement: { ...domino, projectId },
        upsert: true,
      },
    }));

    await DominoModel.bulkWrite([...deleteOps, ...upsertOps]);

    const finalDominos = await DominoModel.find({ projectId }).lean();
    res.status(200).json(finalDominos);
    return
  } catch (error) {
    console.error("도미노 처리 중 에러 발생:", error);
    res.status(500).json({ message: "서버 에러로 도미노 저장에 실패했습니다." });
    return
  }
});

dominosRouter.post("/:projectId/overwrite", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dominos } = req.body;

    if (!Array.isArray(dominos)) {
      res.status(400).json({ message: "'dominos'는 배열이어야 합니다." });
      return;
    }

    await DominoModel.deleteMany({ projectId });

    // eslint-disable-next-line no-unused-vars
    const dominosToInsert = dominos.map(({ _id, ...rest }) => ({
      ...rest,
      projectId,
    }));

    const insertedDominos = await DominoModel.insertMany(dominosToInsert);

    res.status(200).json(insertedDominos);
    return;
  } catch (error) {
    console.error("도미노 덮어쓰기 중 에러:", error);
    res.status(500).json({ message: "도미노 덮어쓰기에 실패했습니다." });
    return;
  }
});

export default dominosRouter;
