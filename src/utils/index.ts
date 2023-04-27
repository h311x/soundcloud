import { SoundCloudLikes, SoundCloudTrack } from '../models/likes-models'

export function filterSongs(likes: SoundCloudLikes) {
  return (
    likes.collection
      // Filter out Playlists
      .filter((el) => el.track)
      // Filter out unstreamable songs
      .filter((el) => el.track?.policy === 'ALLOW')
      .map((el) => el.track!)
  )
}

export function transformLikes(l: SoundCloudTrack[]) {
  return l.map(
    ({
      id,
      media,
      artwork_url,
      title,
      user: { avatar_url, username },
      waveform_url: waveformUrl,
      permalink_url: songUrl
    }) => {
      return {
        id,
        media,
        artworkUrl: (artwork_url ?? avatar_url)?.replace('-large', '-t500x500'),
        title,
        username,
        songUrl,
        waveformUrl
      }
    }
  )
}

export type Song = ReturnType<typeof transformLikes>[number]
