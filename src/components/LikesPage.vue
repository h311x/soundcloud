<script setup lang="ts">
import TracksList from './TracksList.vue'
import { add, isBefore } from 'date-fns'
import SoundCloudAPI from '../lib/soundcloud'
import { store } from '../stores'
import { onMounted, shallowRef } from 'vue'

const sc = new SoundCloudAPI()

async function fetchOrGetFromCache<T extends (...args: any) => unknown>(
  key: string,
  fetcher: T,
  forceRefetch?: boolean
): Promise<Awaited<ReturnType<T>>> {
  const lfKey = `${key}/lastFetched`
  const [hasValue, lastFetched] = await Promise.all([
    store.has(key),
    store.get(lfKey) as Promise<string>
  ])

  if (
    !hasValue ||
    !lastFetched ||
    (lastFetched && isBefore(new Date(lastFetched), new Date())) ||
    forceRefetch
  ) {
    console.time(`Refetching: ${key}`)
    const r = await fetcher()
    await Promise.all([
      store.set(key, r),
      store.set(lfKey, add(new Date(), { minutes: 60 }).toUTCString())
    ])
    await store.save()
    console.timeEnd(`Refetching: ${key}`)

    return r as Awaited<ReturnType<T>>
  }
  return (await store.get(key)) as Awaited<ReturnType<T>>
}

// console.log(await sc.getWeekly())
// console.log(await sc.getPlaylist('https://soundcloud.com/discover/sets/your-playback::h311x:2021'))

const user = shallowRef(await fetchOrGetFromCache('user', () => sc.getUser()))

const likes = shallowRef(
  await fetchOrGetFromCache('likes', () => sc.getLikes(user.value.id, user.value.likes_count))
)

async function refetch() {
  likes.value = await fetchOrGetFromCache(
    'likes',
    () => sc.getLikes(user.value.id, user.value.likes_count),
    true
  )
}

onMounted(async () => {
  console.log(await store.entries())
})
</script>

<template>
  <TracksList @refetch="refetch" :liked-songs="likes" v-if="likes.length" />
</template>
