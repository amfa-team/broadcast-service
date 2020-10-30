import InvalidRequestError from "./InvalidRequestError";

export default class ForbiddenError extends InvalidRequestError {
  constructor() {
    super("Forbidden", 403);
  }
}
