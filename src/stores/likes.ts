import { computed } from 'vue'
import { fetchOrGetFromCache } from './index'
import SoundCloudAPI from '../lib/soundcloud'
import { useQuery } from '@tanstack/vue-query'

const sc = new SoundCloudAPI()

const fetcher = (force?: boolean) => fetchOrGetFromCache('likes', () => sc.getLikes(), force)

export const useLikesStore = async () => {
  const {
    data: likes,
    suspense,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['likes'],
    queryFn: () => fetcher()
  })
  await suspense()

  if (!likes.value) {
    //TODO: Handle Errors Better
    throw new Error('Could not fetch likes')
  }

  const likeIds = computed(() => likes.value.map((el) => el.id))

  return {
    likes,
    refetch,
    isFetching,
    likeIds
  }
}
