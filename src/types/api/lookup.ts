/** Country resource returned by `/lookup/countries`. */
export interface CountryResource {
  code: string;
  name: string;
}

/** Language resource returned by `/lookup/languages`. */
export interface LanguageResource {
  code: string;
  name: string;
}

/** Data shape returned by `/lookup/platforms`. */
export interface LookupPlatformsData {
  platforms: string[];
  aiExcludedPlatforms: string[];
  additionalDelivery: {
    excluded: string[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
