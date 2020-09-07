export class PicnicError extends Error {
  cause: Error | null;

  constructor(message: string, cause: Error | null) {
    super(message);

    this.cause = cause;

    if (process.env.NODE_ENV !== "production") {
      console.error(message, cause);
    }
  }
}

export class InvalidRequestError extends Error {
  readonly code: 400 | 403;

  constructor(message = "invalid request", code: 400 | 403 = 400) {
    super(message);
    this.code = code;
  }
}

export class ForbiddenError extends InvalidRequestError {
  constructor() {
    super("Forbidden", 403);
  }
}
