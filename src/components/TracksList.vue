<script setup lang="ts">
import TrackItem from './TrackItem.vue'
import { onMounted, toRef, watch } from 'vue'
import { Song } from '../utils'
import { useVirtualList } from '@vueuse/core'
import { useGlobalControls } from '../composables/useGlobalControls'
import { PlaylistType } from '../lib/playlistType'

const props = defineProps<{ list: Song[]; playlistType: PlaylistType }>()
const list = toRef(props, 'list')

const [
  { pickSong, selectedSong, currentPlaylist, preloadAudio, selectedPlaylistType },
  setPlaylist
] = useGlobalControls()

// Preselect playlist and preload first song
onMounted(() => {
  if (!currentPlaylist.value.length) {
    setPlaylist(list.value, props.playlistType)
    preloadAudio(0)
  }
})

function selectSongAndPlaylist(idx: number) {
  setPlaylist(list.value, props.playlistType)
  pickSong(idx)
}

const {
  list: virtualizedList,
  containerProps,
  wrapperProps,
  scrollTo
} = useVirtualList(list, { itemHeight: 116 })

// Reset position due to: https://github.com/vueuse/vueuse/issues/2888
watch(list, () => scrollTo(0))

function scrollToSelectedSong() {
  // Don't scroll if it is not currently playing playlist
  if (props.playlistType !== selectedPlaylistType.value) return

  const idx = list.value.findIndex((el) => el.id === selectedSong.value?.id)
  if (idx === -1) return
  scrollTo(idx)
}

onMounted(() => {
  scrollToSelectedSong()
})

watch(selectedSong, () => {
  scrollToSelectedSong()
})
</script>

<template>
  <div
    v-bind="containerProps"
    class="overflow-auto scrollbar scrollbar-track-transparent scrollbar-thumb-slate-200/90 scrollbar-thumb-rounded scrollbar-w-2"
  >
    <div v-bind="wrapperProps" class="flex flex-col relative gap-4">
      <TrackItem
        v-for="{ index, data } in virtualizedList"
        :key="data.id"
        :style="{
          height: `100px`
        }"
        :song="data"
        :is-selected="data.id === selectedSong?.id && selectedPlaylistType === playlistType"
        @click="selectSongAndPlaylist(index)"
      />
    </div>
  </div>
</template>
