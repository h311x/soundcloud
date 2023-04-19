<script setup lang="ts">
import ControlsBar from './ControlsBar.vue'
import { usePlaylist } from '../composables/usePlaylist'
import { computed, ref, watch } from 'vue'
import { useArrayFilter } from '@vueuse/core'
import Button from './ui/Button'
import Input from './ui/Input'
import TrackItem from './TrackItem.vue'
import useVirtualList from '../composables/useVirtualList'
import { SparklesIcon } from '@heroicons/vue/20/solid'
import { Song } from '../utils'

const props = defineProps<{ likedSongs: Song[] }>()
const emit = defineEmits<{
  (e: 'refetch'): void
}>()

const search = ref('')
const lowerSearch = computed(() => search.value.toLowerCase())

const filteredList = useArrayFilter(props.likedSongs, (track) => {
  return (
    track.title.toLowerCase().includes(lowerSearch.value) ||
    track.username.toLowerCase().includes(lowerSearch.value)
  )
})

const currentPlaylist = ref(props.likedSongs)

const { controls, playNext, playPrev, pickSong, selectedSong } = usePlaylist(currentPlaylist)

function shuffle() {
  console.time('Shuffle')
  const s = props.likedSongs
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  console.timeEnd('Shuffle')

  currentPlaylist.value = s
  pickSong(0)
}

const [rowVirtualizer, listRef] = useVirtualList(
  filteredList,
  (idx) => filteredList.value[idx].id.toString() ?? ''
)

function selectSongAndPlaylist(idx: number) {
  currentPlaylist.value = filteredList.value
  pickSong(idx)
}

watch(selectedSong, (v) => {
  const idx = filteredList.value.findIndex((el) => el.id === v?.id)
  if (idx === -1) return
  rowVirtualizer.value.scrollToOffset(
    (idx + 1) * rowVirtualizer.value.options.estimateSize(idx) -
      rowVirtualizer.value.options.scrollMargin,
    {
      behavior: 'smooth'
    }
  )
})
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
      <!-- {{ controls }} -->
      <div class="px-4 pb-4 flex gap-10">
        <Button @click="emit('refetch')" variant="outline"> refetch likes</Button>
      </div>
    </div>

    <div
      ref="listRef"
      class="flex flex-col relative mb-16"
      :style="{
        height: `${rowVirtualizer.getTotalSize()}px`
      }"
    >
      <TrackItem
        v-for="virtualItem in rowVirtualizer.getVirtualItems()"
        :key="virtualItem.key"
        :style="{
          height: `${virtualItem.size - 16}px`,
          transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`
        }"
        :item="filteredList[virtualItem.index]"
        :item-index="virtualItem.index"
        :is-selected="filteredList[virtualItem.index].id === selectedSong?.id"
        @select-song="selectSongAndPlaylist(virtualItem.index)"
      />
    </div>

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
