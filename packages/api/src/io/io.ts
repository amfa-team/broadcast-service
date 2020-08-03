import type { APIGatewayProxyResult } from "aws-lambda";
import { JsonDecoder } from "ts.data.json";
import { InvalidRequestError } from "./exceptions";

export function parse(body: string | null): unknown {
  try {
    return body === null ? body : JSON.parse(body);
  } catch (e) {
    throw new InvalidRequestError(`Unable to parse body: ${e.message}`);
  }
}

export function parseAndValidate<T>(
  body: string | null,
  decoder: JsonDecoder.Decoder<T>
): T {
  const data = parse(body);
  const result = decoder.decode(data);

  if (result.isOk()) {
    return result.value;
  }

  throw new InvalidRequestError(result.error);
}

export function handleErrorResponse(e: unknown): APIGatewayProxyResult {
  if (e instanceof InvalidRequestError) {
    return {
      statusCode: e.code,
      body: JSON.stringify({
        success: false,
        error: e.message,
      }),
    };
  }

  console.log(e);

  return {
    statusCode: 500,
    body: JSON.stringify({
      success: false,
      error: "Unexpected Server error",
    }),
  };
}

export function handleSuccessResponse(data: unknown): APIGatewayProxyResult {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      payload: data,
    }),
  };
}
