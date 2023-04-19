<script setup lang="ts">
import TracksList from './TracksList.vue'
import SoundCloudAPI from '../lib/soundcloud'
import { fetchOrGetFromCache, store } from '../stores'
import { onMounted, shallowRef } from 'vue'

const sc = new SoundCloudAPI()

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
