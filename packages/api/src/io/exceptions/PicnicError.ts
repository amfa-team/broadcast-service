export default class PicnicError extends Error {
  cause: Error | null;

  constructor(message: string, cause: Error | null) {
    super(message);

    this.cause = cause;

    if (process.env.NODE_ENV !== "production") {
      console.error("PicnicError", message, cause);
    }
  }
}
