import express from "express";

import { Project } from "../Models/DominosSchema.js";

const projectsRouter = express.Router();

projectsRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("프로젝트 전체 조회 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 데이터를 불러오지 못했습니다." });
  }
});

projectsRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId });

    if (!project) {
      return res.status(404).json({ message: "일치하는 프로젝트가 없습니다." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("프로젝트 상세 조회 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 데이터를 불러오지 못했습니다." });
  }
});

export default projectsRouter;
