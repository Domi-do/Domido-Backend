import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  tokenType: "access" | "refresh";
}

export interface AuthenticatedRequest<T = any> extends Request {
  user?: CustomJwtPayload;
  body: T;
}