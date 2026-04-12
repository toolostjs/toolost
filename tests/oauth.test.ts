import { describe, expect, it, vi } from "vitest";
import { OAuthManager } from "../src/oauth/OAuthManager";

describe("OAuthManager", () => {
  it("builds a valid authorization URL", () => {
    const manager = new OAuthManager({
      clientId: "client-id",
      clientSecret: "secret",
      redirectUri: "http://localhost/callback",
      scopes: ["read:profile", "read:catalog"],
      authURL: "https://toolost.com/oauth/authorize",
      tokenURL: "https://toolost.com/oauth/token",
      registerURL: "https://toolost.com/oauth/register",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });

    const url = new URL(
      manager.getAuthorizationURL({
        state: "state-1",
        codeChallenge: "challenge",
      }),
    );

    expect(url.origin + url.pathname).toBe(
      "https://toolost.com/oauth/authorize",
    );
    expect(url.searchParams.get("client_id")).toBe("client-id");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("scope")).toBe("read:profile read:catalog");
    expect(url.searchParams.get("state")).toBe("state-1");
    expect(url.searchParams.get("code_challenge")).toBe("challenge");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });

  it("generates PKCE verifier and challenge", () => {
    const manager = new OAuthManager({
      clientId: "client-id",
      redirectUri: "http://localhost/callback",
      scopes: [],
      authURL: "https://toolost.com/oauth/authorize",
      tokenURL: "https://toolost.com/oauth/token",
      registerURL: "https://toolost.com/oauth/register",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });

    const pkce = manager.generatePKCE();

    expect(pkce.codeVerifier).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(pkce.codeChallenge).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(pkce.codeVerifier.length).toBeGreaterThanOrEqual(43);
    expect(pkce.codeChallenge.length).toBeGreaterThanOrEqual(43);
  });
});
