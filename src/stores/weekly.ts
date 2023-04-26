import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'
import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'

export const useWeeklyStore = defineStore('weekly', () => {
  const sc = new SoundCloudAPI()
  const playlist = shallowRef<Awaited<ReturnType<typeof sc.getWeekly>>>()
  const isFetching = ref(false)

  async function refetch(force?: true) {
    if (isFetching.value) return
    isFetching.value = true
    try {
      playlist.value = await fetchOrGetFromCache('weeklyPlaylist', () => sc.getWeekly(), force)
    } catch (e) {
      // TODO: Handle Errors Better
      console.error('Could not refetch', e)
    } finally {
      isFetching.value = false
    }
  }

  return {
    playlist,
    refetch,
    isFetching
  }
})
