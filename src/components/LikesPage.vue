<script setup lang="ts">
import TracksList from './TracksList.vue'
import SoundCloudAPI from '../lib/soundcloud'
import { fetchOrGetFromCache } from '../stores'
import { shallowRef } from 'vue'
import ControlsBar from './ControlsBar.vue'
import { usePlaylist } from '../composables/usePlaylist'
import { computed, ref } from 'vue'
import Button from './ui/Button'
import Input from './ui/Input'
import { SparklesIcon } from '@heroicons/vue/20/solid'

const sc = new SoundCloudAPI()

// TODO: Create weekly playlist
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

const search = ref('')
const lowerSearch = computed(() => search.value.toLowerCase())

const filteredList = computed(() =>
  likes.value.filter((track) => {
    return (
      track.title.toLowerCase().includes(lowerSearch.value) ||
      track.username.toLowerCase().includes(lowerSearch.value)
    )
  })
)

const currentPlaylist = ref(likes.value)

const { controls, playNext, playPrev, pickSong, selectedSong } = usePlaylist(currentPlaylist)

function shuffle() {
  console.time('Shuffle')
  const s = likes.value
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v)
  console.timeEnd('Shuffle')

  currentPlaylist.value = s
  pickSong(0)
}

function selectSongAndPlaylist(idx: number) {
  currentPlaylist.value = filteredList.value
  pickSong(idx)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="sticky top-0 bg-slate-900 z-10">
      <div class="p-4 flex gap-5">
        <Input v-model="search" placeholder="Type to search" spellcheck="false" />
        <Button @click="shuffle">
          <SparklesIcon class="w-5 h-5" />
        </Button>
      </div>

      <div class="px-4 pb-4 flex gap-10">
        <Button @click="refetch" variant="outline"> refetch likes</Button>
      </div>
    </div>

    <TracksList
      :list="filteredList"
      :selected-song="selectedSong"
      @select-song="selectSongAndPlaylist"
    />

    <ControlsBar
      :is-playing="controls.playing.value"
      :size="(controls.currentTime.value / (controls.duration.value + 1)) * 100"
      @next="playNext"
      @prev="playPrev"
      @play="controls.playing.value = true"
      @pause="controls.playing.value = false"
    />
  </div>
</template>
