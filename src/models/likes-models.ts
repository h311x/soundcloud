export interface SoundCloudUser {
  avatar_url: string
  city: string
  comments_count: number
  country_code: string
  created_at: string
  description: any
  followers_count: number
  followings_count: number
  first_name: string
  full_name: string
  groups_count: number
  id: number
  kind: string
  last_modified: string
  last_name: string
  likes_count: number
  playlist_likes_count: number
  permalink: string
  permalink_url: string
  playlist_count: number
  reposts_count: any
  track_count: number
  uri: string
  urn: string
  username: string
  verified: boolean
  visuals: any
  station_urn: string
  station_permalink: string
}

export interface SoundCloudLikes {
  collection: SoundCloudCollectionItem[]
  next_href: string
  query_urn: any
}

export interface SoundCloudCollectionItem {
  created_at: string
  kind: string
  track?: SoundCloudTrack
  playlist?: SoundCloudPlaylist
}

export interface SoundCloudTrack {
  artwork_url?: string
  caption?: string
  commentable: boolean
  comment_count?: number
  created_at: string
  description?: string
  downloadable: boolean
  download_count?: number
  duration: number
  full_duration: number
  embeddable_by: string
  genre?: string
  has_downloads_left: boolean
  id: number
  kind: string
  label_name?: string
  last_modified: string
  license: string
  likes_count?: number
  permalink: string
  permalink_url: string
  playback_count?: number
  public: boolean
  publisher_metadata?: SoundCloudPublisherMetadata
  purchase_title?: string
  purchase_url?: string
  release_date?: string
  reposts_count: number
  secret_token: any
  sharing: string
  state: string
  streamable: boolean
  tag_list: string
  title: string
  track_format: string
  uri: string
  urn: string
  user_id: number
  visuals?: SoundCloudVisuals
  waveform_url: string
  display_date: string
  media: SoundCloudMedia
  station_urn: string
  station_permalink: string
  track_authorization: string
  monetization_model: string
  policy: SoundCloudPolicy
  user: SoundCloudSongUser
}

export type SoundCloudPolicy = 'ALLOW' | 'BLOCK' | 'SNIP'

export interface SoundCloudPublisherMetadata {
  id: number
  urn: string
  artist?: string
  contains_music?: boolean
  publisher?: string
  isrc?: string
  explicit?: boolean
  writer_composer?: string
  release_title?: string
  upc_or_ean?: string
  p_line?: string
  p_line_for_display?: string
  album_title?: string
  c_line?: string
  c_line_for_display?: string
  iswc?: string
}

export interface SoundCloudVisuals {
  urn: string
  enabled: boolean
  visuals: SoundCloudVisual[]
  tracking: any
}

export interface SoundCloudVisual {
  urn: string
  entry_time: number
  visual_url: string
}

export interface SoundCloudMedia {
  transcodings: SoundCloudTranscoding[]
}

export interface SoundCloudTranscoding {
  url: string
  preset: string
  duration: number
  snipped: boolean
  format: SoundCloudFormat
  quality: string
}

export interface SoundCloudFormat {
  protocol: string
  mime_type: string
}

export interface SoundCloudSongUser {
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
  city?: string
  country_code?: string
  badges: SoundCloudBadges
  station_urn: string
  station_permalink: string
}

export interface SoundCloudBadges {
  pro: boolean
  pro_unlimited: boolean
  verified: boolean
}

export interface SoundCloudPlaylist {
  artwork_url?: string
  created_at: string
  duration: number
  id: number
  kind: string
  last_modified: string
  likes_count: number
  managed_by_feeds: boolean
  permalink: string
  permalink_url: string
  public: boolean
  reposts_count: number
  secret_token: any
  sharing: string
  title: string
  track_count: number
  uri: string
  user_id: number
  set_type: string
  is_album: boolean
  published_at?: string
  release_date?: string
  display_date: string
  user: SoundCloudSongUser
}
