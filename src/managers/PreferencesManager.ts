import {
  ArtistPlatform,
  ArtistPlatformResult,
  ArtistPreferencesData,
  EntityId,
  GetArtistViaUrlRequest,
  LabelArtistResource,
  LabelPreferencesData,
  LabelPreferencesQuery,
  MessageResponse,
  PreferenceArtistItem,
  RemoveLabelArtistRequest,
  SearchArtistPlatformRequest,
  SearchArtistPlatformResponseData,
  SubmitArtistPreferenceRequest,
  SubmitLabelPreferenceRequest,
} from "../types/api";
import { BaseManager } from "./BaseManager";

/**
 * Endpoints for artist/label preferences and platform discovery helpers.
 */
export class PreferencesManager extends BaseManager {
  /**
   * Returns the authenticated user's artist preference profile.
   */
  public getArtist(): Promise<ArtistPreferencesData> {
    return this.requestData<ArtistPreferencesData>(
      "GET",
      "/preferences/artist",
    );
  }

  /**
   * Returns artists associated with the authenticated account.
   */
  public getArtists(): Promise<PreferenceArtistItem[]> {
    return this.requestData<PreferenceArtistItem[]>(
      "GET",
      "/preferences/artists",
    );
  }

  /**
   * Returns label preferences and associated artists.
   */
  public getLabel(
    query: LabelPreferencesQuery = {},
  ): Promise<LabelPreferencesData> {
    return this.requestData<LabelPreferencesData>("GET", "/preferences/label", {
      query: {
        search: query.search,
        page: query.page,
        perPage: query.perPage ?? query.limit,
      },
    });
  }

  /**
   * Returns a single label-managed artist by ID.
   */
  public getLabelArtist(id: EntityId): Promise<LabelArtistResource> {
    return this.requestData<LabelArtistResource>(
      "GET",
      `/preferences/label/artist/${id}`,
    );
  }

  /**
   * Searches Spotify artists by name.
   */
  public searchSpotify(
    artist: string,
    limit?: number,
  ): Promise<ArtistPlatformResult[]> {
    return this.requestData<ArtistPlatformResult[]>(
      "GET",
      "/preferences/search-spotify",
      {
        query: { artist, limit },
      },
    );
  }

  /**
   * Searches YouTube channels by name.
   */
  public searchYouTube(
    channel: string,
    limit?: number,
  ): Promise<ArtistPlatformResult[]> {
    return this.requestData<ArtistPlatformResult[]>(
      "GET",
      "/preferences/search-yt-channel",
      {
        query: { channel, limit },
      },
    );
  }

  /**
   * Searches Apple Music artists by name.
   */
  public searchApple(
    artist: string,
    limit?: number,
  ): Promise<ArtistPlatformResult[]> {
    return this.requestData<ArtistPlatformResult[]>(
      "GET",
      "/preferences/search-apple",
      {
        query: { artist, limit },
      },
    );
  }

  /**
   * Resolves a Spotify artist by link or ID.
   */
  public getSpotifyArtist(link: string): Promise<ArtistPlatformResult> {
    return this.requestData<ArtistPlatformResult>(
      "GET",
      "/preferences/get-spotify-artist",
      {
        query: { link },
      },
    );
  }

  /**
   * Resolves a YouTube channel by link.
   */
  public getYTChannel(link: string): Promise<ArtistPlatformResult> {
    return this.requestData<ArtistPlatformResult>(
      "GET",
      "/preferences/get-yt-channel",
      {
        query: { link },
      },
    );
  }

  /**
   * Resolves an Apple Music artist by link.
   */
  public getAppleArtist(link: string): Promise<ArtistPlatformResult> {
    return this.requestData<ArtistPlatformResult>(
      "GET",
      "/preferences/get-apple-artist",
      {
        query: { link },
      },
    );
  }

  /**
   * Resolves an artist profile by platform link.
   */
  public getArtistViaLink(
    link: string,
    platform: ArtistPlatform,
  ): Promise<ArtistPlatformResult> {
    return this.requestData<ArtistPlatformResult>(
      "GET",
      "/preferences/artist-via-link",
      {
        query: { link, platform },
      },
    );
  }

  /**
   * Runs unified artist search across a selected platform.
   */
  public searchArtistPlatform(
    data: SearchArtistPlatformRequest,
  ): Promise<SearchArtistPlatformResponseData> {
    return this.requestData<SearchArtistPlatformResponseData>(
      "POST",
      "/preferences/search/artist-platform",
      {
        body: data,
      },
    );
  }

  /**
   * Resolves an artist by URL and validates the artist name.
   */
  public getArtistViaURL(
    data: GetArtistViaUrlRequest,
  ): Promise<ArtistPlatformResult> {
    return this.requestData<ArtistPlatformResult>(
      "POST",
      "/preferences/artist/get-artist-via-url",
      {
        body: data,
      },
    );
  }

  /**
   * Alias for `getArtistViaURL` with lowercase URL suffix.
   */
  public getArtistViaUrl(
    data: GetArtistViaUrlRequest,
  ): Promise<ArtistPlatformResult> {
    return this.getArtistViaURL(data);
  }

  /**
   * Creates or updates artist preferences.
   */
  public submitArtist(
    data: SubmitArtistPreferenceRequest,
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("POST", "/preferences/artist/submit", {
      body: data,
    });
  }

  /**
   * Creates or updates label preferences.
   */
  public submitLabel(
    data: SubmitLabelPreferenceRequest,
  ): Promise<MessageResponse> {
    return this.request<MessageResponse>("POST", "/preferences/label/submit", {
      body: data,
    });
  }

  /**
   * Removes an artist from label management.
   */
  public removeLabelArtist(
    data: RemoveLabelArtistRequest | EntityId,
  ): Promise<MessageResponse> {
    const payload: RemoveLabelArtistRequest =
      typeof data === "object" ? data : { id: data };

    return this.request<MessageResponse>(
      "POST",
      "/preferences/label/artist/remove",
      {
        body: payload,
      },
    );
  }
}
