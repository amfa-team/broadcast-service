import type { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import InvalidRequestError from "../io/exceptions/InvalidRequestError";
import { handleErrorResponse } from "../io/io";

const SERVER_TOKEN = uuid();

export function getServerToken(): string {
  return SERVER_TOKEN;
}

export function getReqToken(req: Request): string {
  const token = req.header("x-api-key");

  if (!token) {
    throw new InvalidRequestError("Missing x-api-key header");
  }

  return token;
}

export function auth(req: Request): void {
  const token = getReqToken(req);
  if (token !== getServerToken()) {
    throw new Error(`Someone is trying to access admin with token: ${token}`);
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    auth(req);
    next();
  } catch (e) {
    handleErrorResponse(res, e);
  }
}
