// Feature flags configuration
export const FEATURES = {
  DEBATE_MODE: process.env.FEATURE_DEBATE_MODE === 'true',
  TIMELINE_MODE: process.env.FEATURE_TIMELINE_MODE === 'true',
  COMMUNITY_NOTES: process.env.FEATURE_COMMUNITY_NOTES === 'true',
  ADS: process.env.FEATURE_ADS === 'true',
} as const

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature]
}

// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.APP_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const
