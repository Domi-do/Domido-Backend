import express from "express";

import { DominoModel } from "../Models/DominosSchema.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const dominosRouter = express.Router();

dominosRouter.use(verifyAccessToken);

dominosRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const dominos = await DominoModel.find({ projectId }).lean();

    return res.status(200).json(dominos);
  } catch (error) {
    console.error("도미노 조회 중 에러 발생", error);
    return res.status(500).json({ message: "서버 에러로 도미노 데이터를 불러오지 못했습니다." });
  }
});

dominosRouter.post("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dominos } = req.body;

    if (!Array.isArray(dominos)) {
      return res.status(400).json({ message: "dominos'는 배열이어야 합니다" });
    }

    if (dominos.length === 0) {
      await DominoModel.deleteMany({ projectId });
      return res.status(200).json([]);
    }

    const databaseDominos = await DominoModel.find({ projectId }).lean();
    const clientDominoIds = dominos.map((domino) => domino._id).filter(Boolean);

    const deleteOps = databaseDominos
      .filter((domino) => !clientDominoIds.includes(String(domino._id)))
      .map((domino) => ({
        deleteOne: {
          filter: { _id: domino._id },
        },
      }));

    const upsertOps = dominos.map((domino) => {
      const { _id, ...rest } = domino;

      if (_id) {
        return {
          replaceOne: {
            filter: { _id },
            replacement: { ...rest, _id, projectId },
            upsert: true,
          },
        };
      }

      return {
        insertOne: {
          document: { ...rest, projectId },
        },
      };
    });

    await DominoModel.bulkWrite([...deleteOps, ...upsertOps]);

    const finalDominos = await DominoModel.find({ projectId }).lean();
    return res.status(200).json(finalDominos);
  } catch (error) {
    console.error("도미노 처리 중 에러 발생:", error);
    return res.status(500).json({ message: "서버 에러로 도미노 저장에 실패했습니다." });
  }
});

dominosRouter.post("/:projectId/overwrite", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { dominos } = req.body;

    if (!Array.isArray(dominos)) {
      return res.status(400).json({ message: "'dominos'는 배열이어야 합니다." });
    }

    await DominoModel.deleteMany({ projectId });

    // eslint-disable-next-line no-unused-vars
    const dominosToInsert = dominos.map(({ _id, ...rest }) => ({
      ...rest,
      projectId,
    }));

    const insertedDominos = await DominoModel.insertMany(dominosToInsert);

    return res.status(200).json(insertedDominos);
  } catch (error) {
    console.error("도미노 덮어쓰기 중 에러:", error);
    return res.status(500).json({ message: "도미노 덮어쓰기에 실패했습니다." });
  }
});

export default dominosRouter;
