<script setup lang="ts">
import TracksList from './TracksList.vue'
import SoundCloudAPI from '../lib/soundcloud'
import { fetchOrGetFromCache } from '../stores'
import { onMounted, shallowRef } from 'vue'
import ControlsBar from './ControlsBar.vue'
import { computed, ref } from 'vue'
import Button from './ui/Button'
import { SparklesIcon } from '@heroicons/vue/20/solid'
import PredictiveAutocomplete from './PredictiveAutocomplete.vue'
import { useGlobalControls } from '../composables/useGlobalControls'

const sc = new SoundCloudAPI()

// TODO: Create weekly playlist
// console.log(await sc.getWeekly())
// console.log(await sc.getPlaylist('https://soundcloud.com/discover/sets/your-playback::h311x:2021'))

const user = shallowRef(await fetchOrGetFromCache('user', () => sc.getUser()))

const likes = shallowRef(
  await fetchOrGetFromCache('likes', () => sc.getLikes(user.value.id, user.value.likes_count))
)

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

const [
  {
    controls,
    playNext,
    playPrev,
    pickSong,
    selectedSong,
    play,
    pause,
    preloadAudio,
    currentPlaylist
  },
  setPlaylist
] = useGlobalControls()

onMounted(() => {
  if (!currentPlaylist.value.length) {
    setPlaylist(likes.value)
    preloadAudio(0)
  }
})

function shuffle() {
  console.time('Shuffle')
  const s = likes.value
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v)
  console.timeEnd('Shuffle')

  setPlaylist(s)
  pickSong(0)
}

function selectSongAndPlaylist(idx: number) {
  setPlaylist(filteredList.value)
  pickSong(idx)
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="p-4 flex gap-5">
      <div class="w-full">
        <PredictiveAutocomplete v-model="search" :list="likes" />
      </div>
      <Button @click="shuffle">
        <SparklesIcon class="w-5 h-5" />
      </Button>
    </div>

    <TracksList
      class="grow"
      :list="filteredList"
      :selected-song="selectedSong"
      @select-song="selectSongAndPlaylist"
    />

    <ControlsBar
      :is-playing="controls.playing.value"
      :size="(controls.currentTime.value / (controls.duration.value + 1)) * 100"
      @next="playNext"
      @prev="playPrev"
      @play="play"
      @pause="pause"
    />
  </div>
</template>
