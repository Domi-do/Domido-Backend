import express from "express";

import Achievement from "../Models/AchievementSchema.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, name } = req.body;

  const user = await Achievement.findOne({ userId });

  if (!user) {
    await Achievement.create({
      userId,
      achievements: [{ name, achieved: true, date: new Date() }],
    });
    return res.sendStatus(201);
  }

  const already = user.achievements.find((a) => a.name === name);
  if (already) return res.sendStatus(200);

  user.achievements.push({ name, achieved: true, date: new Date() });
  await user.save();
  res.sendStatus(200);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const doc = await Achievement.findOne({ userId }).lean();

    res.json(doc ? doc.achievements : []);
  } catch (err) {
    console.error("업적 조회 실패:", err);
    res.status(500).json({ error: "업적 조회 실패" });
  }
});

export default router;
