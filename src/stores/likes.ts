import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'
import { Song } from '../utils'

export const useLikesStore = defineStore('likes', () => {
  const sc = new SoundCloudAPI()
  const likes = shallowRef<Song[]>([])
  const isFetching = ref(false)

  async function refetch(force?: true) {
    if (isFetching.value) return
    isFetching.value = true
    try {
      likes.value = await fetchOrGetFromCache('likes', () => sc.getLikes(), force)
    } catch (e) {
      // TODO: Handle Errors Better
      console.error('Could not refetch', e)
    } finally {
      isFetching.value = false
    }
  }

  const likeIds = computed(() => likes.value.map((el) => el.id))

  return {
    likes,
    refetch,
    isFetching,
    likeIds
  }
})
