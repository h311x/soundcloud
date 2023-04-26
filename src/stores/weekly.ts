import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'
import { QueryClient, useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'

const sc = new SoundCloudAPI()

const fetcher = (force?: boolean) =>
  fetchOrGetFromCache('weeklyPlaylist', () => sc.getWeekly(), force)

export const useWeeklyStore = async () => {
  const { data: playlist, suspense } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => fetcher()
  })
  await suspense()

  if (!playlist.value) {
    //TODO: Handle Errors Better
    throw new Error('Could not fetch playlist')
  }

  const isRefetching = ref(false)
  const refetch = async () => {
    if (isRefetching.value) return
    isRefetching.value = true
    const queryClient = new QueryClient()
    //TODO: Handle Errors Better
    queryClient.setQueryData(['weekly'], await fetcher(true))
    isRefetching.value = false
  }

  return {
    playlist,
    refetch,
    isRefetching
  }
}
