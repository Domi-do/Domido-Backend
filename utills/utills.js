import jwt from "jsonwebtoken";

import User from "../Models/UserInfoSchema.js";

export const generateAccessToken = (payload) =>
  jwt.sign({ ...payload, tokenType: "access" }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

export const generateRefreshToken = (payload) =>
  jwt.sign({ ...payload, tokenType: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });

export const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({ kakaoId: decoded.userId });

    if (!user) throw new Error("사용자 없음");

    const newAccessToken = generateAccessToken({ userId: user.kakaoId });
    return newAccessToken;
  } catch (error) {
    throw new Error(`토큰 재발급 실패: ${error.message}`);
  }
};
