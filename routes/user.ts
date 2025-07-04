import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import User from "../Models/UserInfoSchema.js";
import {
  generateAccessToken,
  generateRefreshToken,
  createProject,
  insertDominos,
} from "../utils/utils";
import { verifyAccessToken } from "../middlewares/authMiddleware";
import presetDominos from "../presetData/presetDominosWithId.json";
import { AuthenticatedRequest } from "types/AuthenticatedRequest.js";
import { DominoType } from "types/domino.js";

type PresetTitle = keyof typeof presetDominos;

const router = express.Router();

async function getKakaoAccessToken(code: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.KAKAO_REST_API_KEY!);
  params.append("redirect_uri", process.env.KAKAO_REDIRECT_URI!);
  params.append("code", code);

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("카카오 토큰 요청 실패:", error);
    throw new Error(`카카오 토큰 요청 실패: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function getKakaoUserInfo(accessToken: string) {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`카카오 사용자 정보 요청 실패: ${error}`);
  }

  const userInfo = await response.json();
  return userInfo;
}

export const createPresetProjects = async (ownerId: string) => {
  const presetTitles: PresetTitle[] = ["프리셋 1"];

  try {
    const createdProjects = await Promise.all(
      presetTitles.map((title) => createProject({ title, ownerId })),
    );

    await Promise.all(
      createdProjects.map(async (project) => {
        const title = project.title as PresetTitle;
        const dominos = presetDominos[title];

        if (!Array.isArray(dominos)) return;

        const dominosToInsert: DominoType[] = dominos.map((domino) => {
          const { objectInfo, ...rest } = domino;

          return {
            ...rest,
            projectId: project.id,
            objectInfo: {
              ...objectInfo,
              groupName: objectInfo.groupName as "STATIC_OBJECTS" | "DYNAMIC_OBJECTS",
              type: objectInfo.type as "dynamic" | "fixed",
            },
          };
        });

        await insertDominos(project.id, dominosToInsert);
      }),
    );
  } catch (error) {
    console.error("프리셋 프로젝트 생성 중 오류 발생:", error);
    throw new Error("기본 프로젝트 생성에 실패했습니다.");
  }
};

router.post("/login", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ message: "인가 코드가 없습니다." });
    return;
  }

  try {
    const kakaoAccessToken = await getKakaoAccessToken(code);
    const userInfo = await getKakaoUserInfo(kakaoAccessToken);

    if (!userInfo || !userInfo.id) {
      res.status(502).json({ message: "카카오 사용자 정보가 없습니다." });
      return;
    }
    const kakaoId = userInfo.id;
    const userNickname = userInfo.properties.nickname;

    let user = await User.findOne({ kakaoId });

    const accessToken = generateAccessToken({ userId: kakaoId, tokenType: "access" });
    const refreshToken = generateRefreshToken({ userId: kakaoId, tokenType: "refresh" });

    if (!user) {
      user = await User.create({ kakaoId, userNickname, accessToken, refreshToken });
      await createPresetProjects(kakaoId);
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();
    }

    res.status(200).json({
      message: "로그인에 성공했습니다.",
      token: accessToken,
      userID: user._id,
      refreshToken: refreshToken,
      userNickname,
      kakaoAccessToken: kakaoAccessToken,
      isTutorialUser: user.isTutorialUser,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: `카카오 로그인 실패: ${err}` });
      console.error("로그인 처리 실패:", err.message);
    }
  }
});

interface RefreshTokenPayload extends JwtPayload {
  userId: string;
}

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "리프레시 토큰이 없습니다." });
    return;
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as RefreshTokenPayload;

    const user = await User.findOne({ kakaoId: decoded.userId });
    if (!user) {
      res.status(404).json({ message: "사용자가 없습니다." });
      return;
    }

    const newAccessToken = generateAccessToken({ userId: user.kakaoId });

    res.status(200).json({
      message: "새 액세스 토큰 발급 완료",
      token: newAccessToken,
    });
    return;
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "리프레시 토큰이 유효하지 않습니다." });
    return;
  }
});

router.post("/logout", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    res.status(400).json({ message: "액세스 토큰이 없습니다." });
    return;
  }

  const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  if (!response.ok) {
    const error = await response.text();
    res.status(502).json({ message: `카카오 로그아웃 실패: ${error}` });
    return;
  }

  try {
    await User.deleteOne({ accessToken: accessToken });
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error("토큰 삭제 실패", err);
    res.status(500).json({ message: "서버 에러: 토큰 삭제 중 에러" });
  }
});

interface TutorialPatchBody {
  isTutorialUser: boolean;
}

router.patch(
  "/me/tutorial",
  verifyAccessToken,
  async (req: AuthenticatedRequest<TutorialPatchBody>, res) => {
    const kakaoId = req.user?.userId;
    const { isTutorialUser } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { kakaoId },
        { isTutorialUser },
        { new: true, runValidators: true },
      );

      if (!updatedUser) {
        res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        return;
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      res.status(500).json({ message: "사용자 정보 수정 중 오류가 발생했습니다." });
    }
  },
);

export default router;
