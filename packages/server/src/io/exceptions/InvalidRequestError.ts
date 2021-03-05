export default class InvalidRequestError extends Error {
  readonly code: 400 | 403;

  constructor(message = "invalid request", code: 400 | 403 = 400) {
    super(message);
    this.code = code;
  }
}
