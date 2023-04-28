import { computed, ref } from 'vue'
import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'
import { QueryClient, useQuery } from '@tanstack/vue-query'

const sc = new SoundCloudAPI()

const fetcher = (force?: boolean) => fetchOrGetFromCache('likes', () => sc.getLikes(), force)

export const useLikesStore = async () => {
  const { data: likes, suspense } = useQuery({
    queryKey: ['likes'],
    queryFn: () => fetcher()
  })
  await suspense()

  if (!likes.value) {
    //TODO: Handle Errors Better
    throw new Error('Could not fetch likes')
  }

  const isRefetching = ref(false)
  const refetch = async () => {
    if (isRefetching.value) return
    isRefetching.value = true
    const queryClient = new QueryClient()
    //TODO: Handle Errors Better
    queryClient.setQueryData(['likes'], await fetcher(true))
    isRefetching.value = false
  }

  const likeIds = computed(() => new Set(likes.value.map((el) => el.id)))

  return {
    likes,
    refetch,
    isRefetching,
    likeIds
  }
}
