<script setup lang="ts">
import TracksList from '../components/TracksList.vue'
import { computed, ref } from 'vue'
import Button from '../components/ui/Button'
import { SparklesIcon, ArrowPathIcon } from '@heroicons/vue/20/solid'
import PredictiveAutocomplete from '../components/PredictiveAutocomplete.vue'
import { useGlobalControls } from '../composables/useGlobalControls'
import TypographyH3 from '../components/typography/TypographyH3.vue'
import { PlaylistType } from '../lib/playlistType'
import { useLikesStore } from '../stores/likes'

const { likes, refetch, isRefetching } = await useLikesStore()

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

const [{ pickSong }, setPlaylist] = useGlobalControls()

function shuffle() {
  console.time('Shuffle')
  const s = likes.value
    .map((v) => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v)
  console.timeEnd('Shuffle')

  setPlaylist(s, PlaylistType.Likes)
  pickSong(0)
}
</script>

<template>
  <div class="flex flex-col">
    <div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <TypographyH3>Your likes</TypographyH3>
        <Button @click="refetch()" variant="ghost">
          <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isRefetching }" />
        </Button>
      </div>
      <div class="flex gap-5">
        <div class="w-full">
          <PredictiveAutocomplete v-model="search" :list="likes" />
        </div>
        <Button @click="shuffle">
          <SparklesIcon class="w-5 h-5" />
        </Button>
      </div>
    </div>

    <TracksList :list="filteredList" :playlistType="PlaylistType.Likes" />
  </div>
</template>
