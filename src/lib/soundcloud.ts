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
  private readonly profileUrl = import.meta.env.VITE_CLIENT_PROFILE
  private readonly weeklyUrl = import.meta.env.VITE_CLIENT_WEEKLY
  private readonly baseURL = 'https://api-v2.soundcloud.com'

  public async getLikes(id: number, amount?: number) {
    const likes = await tauriFetch<SoundCloudLikes>(
      new URL(`/users/${id}/likes`, this.baseURL).href,
      {
        method: 'GET',
        query: {
          client_id: this.clientId,
          limit: amount?.toString()
        }
      }
    )
    return transformLikes(filterSongs(likes.data))
  }

  public async getUser() {
    const user = await tauriFetch<SoundCloudUser>(new URL('/resolve', this.baseURL).href, {
      method: 'GET',
      query: {
        url: this.profileUrl,
        client_id: this.clientId
      }
    })
    return user.data
  }

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

  async getStreamLink(media: SoundCloudMedia) {
    return await this.fromMediaUrl(
      media.transcodings.find(
        (el) => el.format.mime_type === 'audio/mpeg' && el.format.protocol === 'hls'
      )!
    )
  }

  public async getSetInfo(url: string) {
    const { data } = await tauriFetch<SoundCloudWeekly>(new URL(`/resolve`, this.baseURL).href, {
      method: 'GET',
      query: {
        url,
        client_id: this.clientId
      }
    })
    return data
  }

  public async getTrackInfo(ids: number[]) {
    const { data } = await tauriFetch<SoundCloudTrack[]>(new URL(`/tracks`, this.baseURL).href, {
      method: 'GET',
      query: {
        ids: ids.join(','),
        client_id: this.clientId
      }
    })
    return data
  }

  public async getPlaylist(url: string) {
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
