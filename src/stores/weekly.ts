import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'
import { QueryClient, useQuery } from '@tanstack/vue-query'

const sc = new SoundCloudAPI()

const fetcher = (force?: boolean) =>
  fetchOrGetFromCache('weeklyPlaylist', () => sc.getWeekly(), force)

export const useWeeklyStore = async () => {
  const {
    data: playlist,
    suspense,
    isFetching
  } = useQuery({
    queryKey: ['weekly'],
    queryFn: () => fetcher()
  })
  await suspense()

  if (!playlist.value) {
    //TODO: Handle Errors Better
    throw new Error('Could not fetch playlist')
  }

  const refetch = async () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['weekly'], await fetcher(true))
  }

  return {
    playlist,
    refetch,
    isFetching
  }
}
