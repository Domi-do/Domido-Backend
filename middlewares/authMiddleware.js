import jwt from "jsonwebtoken";

import { refreshAccessToken } from "../utills/utills.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "인증 토큰이 없습니다." });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return tryRefreshLogin(req, res, next);
    }

    return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
  }
};

async function tryRefreshLogin(req, res, next) {
  try {
    const refreshToken = req.headers["refresh-token"]?.split(" ")[1];

    if (!refreshToken) {
      return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    }

    const newAccessToken = await refreshAccessToken(refreshToken);
    const decoded = jwt.decode(newAccessToken);

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.setHeader("refresh-token", `Bearer ${refreshToken}`);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "리프레쉬 토큰이 유효하지 않습니다." });
    throw new Error(`액세스 토큰 재발급 실패: ${error.message}`);
  }
}
