import express from "express";

import User from "../Models/UserInfoSchema.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, name } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const dup = user.achievements.some((a) => a.name === name);
    if (dup) return res.sendStatus(200);

    user.achievements.push({ name, achieved: true, date: new Date() });
    await user.save();

    res.sendStatus(201);
    console.log("업적 저장 성공");
  } catch (err) {
    console.error("업적 저장 실패:", err);
    res.status(500).json({ error: "업적 저장 실패" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).lean();
    res.json(user ? user.achievements : []);
  } catch (err) {
    console.error("업적 조회 실패:", err);
    res.status(500).json({ error: "업적 조회 실패" });
  }
});

export default router;
