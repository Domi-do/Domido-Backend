import jwt from "jsonwebtoken";

export function generateAccessToken(payload) {
  return jwt.sign({ ...payload, tokenType: "access" }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
}

export function generateRefreshToken(payload) {
  return jwt.sign({ ...payload, tokenType: "refresh" }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}
