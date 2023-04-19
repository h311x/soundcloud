export interface SoundCloudWeekly {
  urn: string
  query_urn: string
  permalink: string
  permalink_url: string
  title: string
  description: string
  short_title: string
  short_description: string
  tracking_feature_name: string
  playlist_type: string
  last_updated: string
  artwork_url: any
  calculated_artwork_url: string
  likes_count: number
  seed: any
  tracks: SoundCloudTrack[]
  is_public: boolean
  made_for: SoundCloudMadeFor
  user: SoundCloudUser
  kind: string
  id: string
}

export interface SoundCloudTrack {
  id: number
  kind: string
  monetization_model: string
  policy: string
}

export interface SoundCloudMadeFor {
  avatar_url: string
  first_name: string
  followers_count: number
  full_name: string
  id: number
  kind: string
  last_modified: string
  last_name: string
  permalink: string
  permalink_url: string
  uri: string
  urn: string
  username: string
  verified: boolean
  city: string
  country_code: string
  station_urn: string
  station_permalink: string
}

export interface SoundCloudUser {
  avatar_url: string
  first_name: string
  followers_count: number
  full_name: string
  id: number
  kind: string
  last_modified: string
  last_name: string
  permalink: string
  permalink_url: string
  uri: string
  urn: string
  username: string
  verified: boolean
  city: string
  country_code: string
  station_urn: string
  station_permalink: string
}
