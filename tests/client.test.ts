import { describe, expect, it, vi } from "vitest";
import { TooLostClient } from "../src/client/TooLostClient";

const makeUser = () => ({
  id: 1,
  first_name: "Too",
  last_name: "Lost",
  username: "toolost",
  email: "hello@toolost.com",
  avatar: "avatar.png",
  type: "artist" as const,
  confirmed: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
});

describe("TooLostClient", () => {
  it("unwraps API response data and sends bearer auth", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify({ data: makeUser() }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    const client = new TooLostClient({
      clientId: "client-id",
      redirectUri: "http://localhost/callback",
      accessToken: "access-1",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const user = await client.user.getMe();

    expect(user.id).toBe(1);
    expect(user.firstName).toBe("Too");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const firstCall = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(firstCall[0]).toBe("https://api.toolost.com/v1/me");
    expect((firstCall[1].headers as Record<string, string>).Authorization).toBe(
      "Bearer access-1",
    );
  });

  it("auto refreshes and retries once on 401", async () => {
    let meCalls = 0;

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.endsWith("/me")) {
        meCalls += 1;

        if (meCalls === 1) {
          return new Response(JSON.stringify({ message: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const headers = init?.headers as Record<string, string>;
        if (headers.Authorization !== "Bearer access-2") {
          throw new Error("Expected refreshed bearer token");
        }

        return new Response(JSON.stringify({ data: makeUser() }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.endsWith("/oauth/token")) {
        return new Response(
          JSON.stringify({
            token_type: "Bearer",
            expires_in: 3600,
            access_token: "access-2",
            refresh_token: "refresh-2",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      throw new Error(`Unexpected URL ${url}`);
    });

    const client = new TooLostClient({
      clientId: "client-id",
      redirectUri: "http://localhost/callback",
      accessToken: "access-1",
      refreshToken: "refresh-1",
      fetch: fetchMock as unknown as typeof fetch,
    });

    const refreshSpy = vi.fn();
    client.on("tokenRefresh", refreshSpy);

    const user = await client.user.getMe();

    expect(user.id).toBe(1);
    expect(user.firstName).toBe("Too");
    expect(meCalls).toBe(2);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(client.accessToken).toBe("access-2");
    expect(client.refreshToken).toBe("refresh-2");
  });
});
