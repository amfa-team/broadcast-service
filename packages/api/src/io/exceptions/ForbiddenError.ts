import InvalidRequestError from "./InvalidRequestError";

export default class ForbiddenError extends InvalidRequestError {
  constructor(reason: string) {
    super(`Forbidden: ${reason}`, 403);
  }
}
