import express from "express";

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
      throw new Error("카카오 사용자 정보가 없습니다.");
    }

    const kakaoId = userInfo.id;

    let user = await User.findOne({ kakaoId });
    if (!user) {
      user = await User.create({ kakaoId });
    }

    const accessToken = generateAccessToken({ userId: user.kakaoId });
    const refreshToken = generateRefreshToken({ userId: user.kakaoId });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "로그인 성공",
        token: accessToken,
        user: { id: user._id },
      });
  } catch (err) {
    console.error("로그인 처리 실패:", err.message);
    res.status(500).json({ message: "카카오 로그인 실패", detail: err.message });
  }
});

export default router;
