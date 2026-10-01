import { TooLostClient } from "../client/TooLostClient";
import { HTTPMethod, RequestOptions } from "../types/client";

/**
 * Base manager shared by all resource managers.
 */
export class BaseManager {
  protected readonly client: TooLostClient;

  public constructor(client: TooLostClient) {
    this.client = client;
  }

  /** Executes a raw request without unwrapping the `{ data }` envelope. */
  protected request<T>(
    method: HTTPMethod,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.client.request(method, path, options);
  }

  /** Executes a request and unwraps the `{ data }` envelope when present. */
  protected requestData<T>(
    method: HTTPMethod,
    path: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.client.requestData(method, path, options);
  }
}
