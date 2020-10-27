export default class PicnicError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        if (process.env.NODE_ENV !== "production") {
            console.error(message, cause);
        }
    }
}
//# sourceMappingURL=PicnicError.js.map