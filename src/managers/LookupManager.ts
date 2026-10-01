import {
  CountryResource,
  LookupPlatformsData,
  LanguageResource,
} from "../types/api";
import { BaseManager } from "./BaseManager";

/**
 * Endpoints for static lookup data (countries, platforms, genres, languages).
 */
export class LookupManager extends BaseManager {
  /**
   * Returns all supported countries.
   */
  public countries(): Promise<CountryResource[]> {
    return this.requestData<CountryResource[]>("GET", "/lookup/countries");
  }

  /**
   * Returns available delivery platforms and related exclusions.
   */
  public platforms(): Promise<LookupPlatformsData> {
    return this.requestData<LookupPlatformsData>("GET", "/lookup/platforms");
  }

  /**
   * Returns all available genres.
   */
  public genres(): Promise<string[]> {
    return this.requestData<string[]>("GET", "/lookup/genres");
  }

  /**
   * Returns all supported lyric/language options.
   */
  public languages(): Promise<LanguageResource[]> {
    return this.requestData<LanguageResource[]>("GET", "/lookup/languages");
  }
}
