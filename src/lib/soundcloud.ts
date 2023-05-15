import { fetch as tauriFetch } from '@tauri-apps/api/http'
import {
  SoundCloudLikes,
  SoundCloudMedia,
  SoundCloudTrack,
  SoundCloudTranscoding,
  SoundCloudUser
} from '../models/likes-models'
import { SoundCloudWeekly } from '../models/weekly-models'
import { filterSongs, transformLikes } from '../utils'

export default class SoundCloudAPI {
  private readonly clientId = import.meta.env.VITE_CLIENT_ID
  private readonly profileUrl = `https://soundcloud.com/${import.meta.env.VITE_CLIENT_PROFILE_NAME}`
  private readonly weeklyUrl = `https://soundcloud.com/discover/sets/weekly::${
    import.meta.env.VITE_CLIENT_PROFILE_NAME
  }`
  private readonly baseURL = 'https://api-v2.soundcloud.com'

  private async fromMediaUrl(transcoding: SoundCloudTranscoding) {
    const {
      data: { url }
    } = await tauriFetch<{ url: string }>(transcoding.url, {
      method: 'GET',
      query: {
        client_id: this.clientId
      }
    })
    return url
  }

  public async getLikes() {
    const user = await this.getUser()
    const likes = await tauriFetch<SoundCloudLikes>(
      new URL(`/users/${user.id}/likes`, this.baseURL).href,
      {
        method: 'GET',
        query: {
          client_id: this.clientId,
          limit: user.likes_count.toString()
        }
      }
    )
    return transformLikes(filterSongs(likes.data))
  }

  private async getUser() {
    const user = await tauriFetch<SoundCloudUser>(new URL('/resolve', this.baseURL).href, {
      method: 'GET',
      query: {
        url: this.profileUrl,
        client_id: this.clientId
      }
    })
    if (user.status === 401) {
      throw new Error('client_id expired')
    }
    return user.data
  }

  public async getStreamLink(media: SoundCloudMedia) {
    return await this.fromMediaUrl(
      media.transcodings.find(
        (el) => el.format.mime_type === 'audio/mpeg' && el.format.protocol === 'hls'
      )!
    )
  }

  private async getSetInfo(url: string) {
    const { data } = await tauriFetch<SoundCloudWeekly>(new URL(`/resolve`, this.baseURL).href, {
      method: 'GET',
      query: {
        url,
        client_id: this.clientId
      }
    })
    return data
  }

  private async getTrackInfo(ids: number[]) {
    const { data } = await tauriFetch<SoundCloudTrack[]>(new URL(`/tracks`, this.baseURL).href, {
      method: 'GET',
      query: {
        ids: ids.join(','),
        client_id: this.clientId
      }
    })
    return data
  }

  private async getPlaylist(url: string) {
    // TODO: Check if 50 elements or more?
    const { title, tracks } = await this.getSetInfo(url)

    return {
      title,
      tracks: transformLikes(await this.getTrackInfo(tracks.map((el) => el.id)))
    }
  }

  public async getWeekly() {
    return await this.getPlaylist(this.weeklyUrl)
  }
}
