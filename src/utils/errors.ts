/**
 * Error thrown for non-2xx Too Lost API responses.
 */
export class TooLostAPIError extends Error {
  public readonly status: number;
  public readonly body?: unknown;

  public constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "TooLostAPIError";
    this.status = status;
    this.body = body;
  }
}
