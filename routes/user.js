import express from "express";
import jwt from "jsonwebtoken";

import User from "../Models/UserInfoSchema.js";
import { generateAccessToken, generateRefreshToken } from "../utills/utills.js";

const router = express.Router();

async function getKakaoAccessToken(code) {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.KAKAO_REST_API_KEY);
  params.append("redirect_uri", process.env.KAKAO_REDIRECT_URI);
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

async function getKakaoUserInfo(accessToken) {
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

router.post("/login", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "인가 코드가 없습니다." });
  }

  try {
    const kakaoAccessToken = await getKakaoAccessToken(code);
    const userInfo = await getKakaoUserInfo(kakaoAccessToken);

    if (!userInfo || !userInfo.id) {
      return res.status(502).json({ message: "카카오 사용자 정보가 없습니다." });
    }
    const kakaoId = userInfo.id;
    const userNickname = userInfo.properties.nickname;

    let user = await User.findOne({ kakaoId });

    const accessToken = generateAccessToken({ userId: kakaoId, tokenType: "access" });
    const refreshToken = generateRefreshToken({ userId: kakaoId, tokenType: "refresh" });

    if (!user) {
      user = await User.create({ kakaoId, userNickname, accessToken, refreshToken });
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
    });
  } catch (err) {
    console.error("로그인 처리 실패:", err.message);
    res.status(500).json({ message: `카카오 로그인 실패: ${err}` });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "리프레시 토큰이 없습니다." });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findOne({ kakaoId: decoded.userId });
    if (!user) {
      return res.status(404).json({ message: "사용자가 없습니다." });
    }

    const newAccessToken = generateAccessToken({ userId: user.kakaoId });

    return res.status(200).json({
      message: "새 액세스 토큰 발급 완료",
      token: newAccessToken,
    });
  } catch (err) {
    console.err(err);
    return res.status(403).json({ message: "리프레시 토큰이 유효하지 않습니다." });
  }
});

router.post("/logout", async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: "액세스 토큰이 없습니다." });
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
    return res.status(502).json({ message: `카카오 로그아웃 실패: ${error}` });
  }

  try {
    await User.deleteOne({ accessToken: accessToken });
    res.status(200).json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error("토큰 삭제 실패", err);
    res.status(500).json({ message: "서버 에러: 토큰 삭제 중 에러" });
  }
});

export default router;
