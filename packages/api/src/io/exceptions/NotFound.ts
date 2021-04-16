import InvalidRequestError from "./InvalidRequestError";

export default class NotFoundError extends InvalidRequestError {
  constructor(reason: string) {
    super(`NotFound: ${reason}`, 403);
  }
}
