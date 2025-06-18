import express from "express";

import { ProjectModel } from "../Models/ProjectSchema.js";
import { DominoModel } from "../Models/DominosSchema.js";
import { createProject } from "../utills/utills.js";
import { verifyAccessToken } from "../middlewares/authMiddleware.js";

const projectsRouter = express.Router();

projectsRouter.use(verifyAccessToken);

projectsRouter.get("/", async (req, res) => {
  try {
    const user = req.user;
    const projects = await ProjectModel.find({ ownerId: user.userId });

    res.status(200).json(projects);
  } catch (error) {
    console.error("프로젝트 전체 조회 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 프로젝트를 불러오지 못했습니다." });
  }
});

projectsRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectModel.findOne({ _id: projectId });

    if (!project) {
      return res.status(404).json({ message: "일치하는 프로젝트가 없습니다." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("프로젝트 상세 조회 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 프로젝트 상세 정보를 불러오지 못했습니다." });
  }
});

projectsRouter.post("/", async (req, res) => {
  try {
    const user = req.user;
    const title = req.body.title;
    const newProject = await createProject({ title, ownerId: user.userId });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("프로젝트 생성 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 프로젝트를 저장하지 못했습니다." });
  }
});

projectsRouter.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    await ProjectModel.deleteOne({ _id: projectId });
    const deletedDominos = await DominoModel.deleteMany({ projectId });

    res.status(200).json({
      message: "프로젝트 및 연결된 도미노가 성공적으로 삭제되었습니다.",
      deletedProjectId: projectId,
      deletedDominoCount: deletedDominos.deletedCount,
    });
  } catch (error) {
    console.error("프로젝트 삭제 중 에러 발생", error);
    res.status(500).json({ message: "서버 에러로 프로젝트를 삭제하지 못했습니다." });
  }
});

projectsRouter.patch("/:projectId", async (req, res) => {
  const { title } = req.body;
  const { projectId } = req.params;

  if (!title) {
    return res.status(400).json({ message: "프로젝트 제목이 필요합니다." });
  }

  try {
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { title },
      { new: true },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "요청한 프로젝트가 없습니다." });
    }

    return res.status(200).json(updatedProject);
  } catch (err) {
    console.error("프로젝트 수정 실패:", err);
    return res.status(500).json({ message: "서버 에러로 프로젝트 타이틀 수정에 실패했습니다." });
  }
});

export default projectsRouter;
