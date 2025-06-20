import jwt, { JwtPayload } from "jsonwebtoken";

import { refreshAccessToken } from "../utils/utils";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyAccessToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      res.status(401).json({ message: "인증 토큰이 없습니다." });
      return;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      tryRefreshLogin(req, res, next);
      return;
    }

    res.status(403).json({ message: "토큰이 유효하지 않습니다." });
  }
};

async function tryRefreshLogin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const rawRefreshHeader = req.headers["refresh-token"];
    if (!rawRefreshHeader) {
      return res.status(403).json({ message: "토큰이 유효하지 않습니다." });
    }

    const refreshToken = Array.isArray(rawRefreshHeader)
      ? rawRefreshHeader[0].split(" ")[1]
      : rawRefreshHeader.split(" ")[1];

    const newAccessToken = await refreshAccessToken(refreshToken);
    const decoded = jwt.decode(newAccessToken);

    if (!decoded) {
      return res.status(403).json({ message: "디코딩 실패: 잘못된 토큰입니다." });
    }

    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.setHeader("refresh-token", `Bearer ${refreshToken}`);

    req.user = decoded;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    res.status(403).json({ message: "리프레쉬 토큰이 유효하지 않습니다." });
    throw new Error(`액세스 토큰 재발급 실패: ${errorMessage}`);
  }
}
