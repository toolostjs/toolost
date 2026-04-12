import { describe, expect, it, vi } from "vitest";
import { TooLostClient } from "../src/client/TooLostClient";

function setupClient() {
  const calls: Array<{ url: string; init: RequestInit }> = [];

  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init: init ?? {} });
    return new Response(JSON.stringify({ data: { ok: true } }), {
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

  return { client, calls };
}

function expectCall(
  calls: Array<{ url: string; init: RequestInit }>,
  index: number,
  method: string,
  pathname: string,
) {
  expect(calls[index].init.method).toBe(method);
  expect(new URL(calls[index].url).pathname).toBe(pathname);
}

describe("Manager endpoint mapping", () => {
  it("maps releases manager endpoints", async () => {
    const { client, calls } = setupClient();

    await client.releases.list({ page: 2, perPage: 10, status: "draft" });
    await client.releases.get(42);
    await client.releases.create({
      type: "Album",
      title: "New Release",
      participants: [{ name: "Artist", role: ["primary"] }],
    });
    await client.releases.delete(42);
    await client.releases.updateMetadata(42, { title: "Updated" });
    await client.releases.updateDelivery(42, {
      delivery: {
        platforms: ["Spotify"],
        territories: ["US"],
      },
    });
    await client.releases.updateVideo(42, {
      video: {
        videoUrl: "https://cdn.example.com/video.mp4",
        videoType: "official_music_video",
      },
    });
    await client.releases.submit(42, {
      acceptTerms: true,
      confirmRights: true,
      confirmYoutubeRights: true,
      idempotencyKey: "release-42-submit",
    });
    await client.releases.validateUPC("123456789012", 42);

    expectCall(calls, 0, "GET", "/v1/releases");
    const listUrl = new URL(calls[0].url);
    expect(listUrl.searchParams.get("page")).toBe("2");
    expect(listUrl.searchParams.get("perPage")).toBe("10");
    expect(listUrl.searchParams.get("status")).toBe("draft");

    expectCall(calls, 1, "GET", "/v1/releases/42");
    expectCall(calls, 2, "POST", "/v1/releases");
    expectCall(calls, 3, "DELETE", "/v1/releases/42");
    expectCall(calls, 4, "PATCH", "/v1/releases/42/metadata");
    expectCall(calls, 5, "PATCH", "/v1/releases/42/delivery");
    expectCall(calls, 6, "PATCH", "/v1/releases/42/video");
    expectCall(calls, 7, "POST", "/v1/releases/42/submit");
    expectCall(calls, 8, "POST", "/v1/releases/validate/upc");
  });

  it("maps tracks manager endpoints", async () => {
    const { client, calls } = setupClient();

    await client.tracks.list(5);
    await client.tracks.get(5, 7);
    await client.tracks.uploadURL(5, {
      kind: "audio",
      fileName: "track.flac",
      contentType: "audio/flac",
    });
    await client.tracks.updateFile(5, 7, {
      kind: "audio",
      fileKey: "external/tracks/v1/releases/5/audio/track.flac",
    });
    await client.tracks.validateISRC("USRC17607839");
    await client.tracks.replaceAll(5, [{ title: "Track 1" }]);

    expectCall(calls, 0, "GET", "/v1/releases/5/tracks");
    expectCall(calls, 1, "GET", "/v1/releases/5/tracks/7");
    expectCall(calls, 2, "POST", "/v1/releases/5/tracks/upload-url");
    expectCall(calls, 3, "PATCH", "/v1/releases/5/tracks/7/file");
    expectCall(calls, 4, "POST", "/v1/releases/validate/isrc");
    expectCall(calls, 5, "PUT", "/v1/releases/5/tracks");
  });

  it("maps preferences, lookup, and user endpoints", async () => {
    const { client, calls } = setupClient();

    await client.user.getMe();

    await client.preferences.getArtist();
    await client.preferences.getArtists();
    await client.preferences.getLabel({ search: "nova", perPage: 10, page: 2 });
    await client.preferences.getLabelArtist(11);
    await client.preferences.searchSpotify("artist", 5);
    await client.preferences.searchYouTube("artist", 5);
    await client.preferences.searchApple("artist", 5);
    await client.preferences.getSpotifyArtist(
      "https://open.spotify.com/artist/123",
    );
    await client.preferences.getYTChannel("https://youtube.com/@artist");
    await client.preferences.getAppleArtist(
      "https://music.apple.com/artist/id1",
    );
    await client.preferences.getArtistViaLink(
      "https://open.spotify.com/artist/123",
      "spotify",
    );
    await client.preferences.searchArtistPlatform({
      term: "artist",
      platform: "spotify",
      limit: 5,
    });
    await client.preferences.getArtistViaURL({
      name: "Artist",
      platform: "spotify",
      url: "https://open.spotify.com/artist/123",
    });
    await client.preferences.submitArtist({
      artistName: "Artist",
      metadata: {
        artists: [{ name: "Artist", role: "Main Artist" }],
      },
    });
    await client.preferences.submitLabel({ name: "Label" });
    await client.preferences.removeLabelArtist(11);

    await client.lookup.countries();
    await client.lookup.platforms();
    await client.lookup.genres();
    await client.lookup.languages();

    expectCall(calls, 0, "GET", "/v1/me");
    expectCall(calls, 1, "GET", "/v1/preferences/artist");
    expectCall(calls, 2, "GET", "/v1/preferences/artists");
    expectCall(calls, 3, "GET", "/v1/preferences/label");
    expectCall(calls, 4, "GET", "/v1/preferences/label/artist/11");
    expectCall(calls, 5, "GET", "/v1/preferences/search-spotify");
    expectCall(calls, 6, "GET", "/v1/preferences/search-yt-channel");
    expectCall(calls, 7, "GET", "/v1/preferences/search-apple");
    expectCall(calls, 8, "GET", "/v1/preferences/get-spotify-artist");
    expectCall(calls, 9, "GET", "/v1/preferences/get-yt-channel");
    expectCall(calls, 10, "GET", "/v1/preferences/get-apple-artist");
    expectCall(calls, 11, "GET", "/v1/preferences/artist-via-link");
    expectCall(calls, 12, "POST", "/v1/preferences/search/artist-platform");
    expectCall(calls, 13, "POST", "/v1/preferences/artist/get-artist-via-url");
    expectCall(calls, 14, "POST", "/v1/preferences/artist/submit");
    expectCall(calls, 15, "POST", "/v1/preferences/label/submit");
    expectCall(calls, 16, "POST", "/v1/preferences/label/artist/remove");
    expectCall(calls, 17, "GET", "/v1/lookup/countries");
    expectCall(calls, 18, "GET", "/v1/lookup/platforms");
    expectCall(calls, 19, "GET", "/v1/lookup/genres");
    expectCall(calls, 20, "GET", "/v1/lookup/languages");
  });
});
