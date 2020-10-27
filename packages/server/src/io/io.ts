import { captureException } from "@sentry/node";
import type { Response } from "express";
import type { JsonDecoder } from "ts.data.json";
import InvalidRequestError from "./exceptions/InvalidRequestError";

export function parse(body: string | null): unknown {
  try {
    return body === null ? body : JSON.parse(body);
  } catch (e) {
    throw new InvalidRequestError(`Unable to parse body: ${e.message}`);
  }
}

export function parseAndValidate<T>(
  body: string | null,
  decoder: JsonDecoder.Decoder<T>,
): T {
  const data = parse(body);
  const result = decoder.decode(data);

  if (result.isOk()) {
    return result.value;
  }

  throw new InvalidRequestError(result.error);
}

export function handleErrorResponse(res: Response, e: unknown): Response {
  if (e instanceof InvalidRequestError) {
    return res.status(e.code).send({
      success: false,
      error: e.message,
    });
  }

  captureException(e);

  return res.status(500).json({
    success: false,
    error: "Unexpected Server error",
  });
}

export function handleSuccessResponse(res: Response, data: unknown): Response {
  return res.status(200).json({
    success: true,
    payload: data,
  });
}
