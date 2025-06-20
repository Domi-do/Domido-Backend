import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../Models/UserInfoSchema.js";
import { ProjectModel } from "../Models/ProjectSchema.js";
import { DominoModel } from "../Models/DominosSchema.js";
import { DominoType } from "types/domino.js";

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  tokenType?: "refresh" | "access";
}

export const generateAccessToken = (payload: RefreshTokenPayload) =>
  jwt.sign({ ...payload, tokenType: "access" }, process.env.JWT_SECRET!, {
    expiresIn: "6h",
  });

export const generateRefreshToken = (payload: RefreshTokenPayload) =>
  jwt.sign({ ...payload, tokenType: "refresh" }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshTokenPayload;
    const user = await User.findOne({ kakaoId: decoded.userId });

    if (!user) throw new Error("사용자가 없습니다");

    const newAccessToken = generateAccessToken({ userId: user.kakaoId });
    return newAccessToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`토큰 재발급 실패: ${error.message}`);
    }
    throw new Error("알 수 없는 에러가 발생했습니다");
  }
};

export const createProject = async ({ title, ownerId }: { title: string; ownerId: string }) => {
  try {
    const newProject = await ProjectModel.create({
      title,
      ownerId,
    });

    return newProject;
  } catch (error) {
    console.error("프로젝트 생성 중 에러 발생:", error);
    throw error;
  }
};

export const insertDominos = async (projectId: string, dominos: DominoType[]) => {
  if (!projectId || !Array.isArray(dominos)) {
    throw new Error("유효하지 않은 projectId 또는 도미노 배열입니다.");
  }

  const dominosWithProjectId = dominos.map((domino) => ({
    ...domino,
    projectId,
  }));

  try {
    await DominoModel.insertMany(dominosWithProjectId);
  } catch (err) {
    console.error("도미노 삽입 실패:", err);
    throw err;
  }
};
