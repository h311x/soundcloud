<script setup lang="ts">
import TrackItem from './TrackItem.vue'
import { onMounted, toRef, watch } from 'vue'
import { Song } from '../utils'
import { useVirtualList } from '@vueuse/core'

const props = defineProps<{ list: Song[]; selectedSong: Song | undefined }>()
defineEmits<{
  (e: 'select-song', v: number): void
}>()
const list = toRef(props, 'list')

const {
  list: virtualizedList,
  containerProps,
  wrapperProps,
  scrollTo
} = useVirtualList(list, { itemHeight: 116 })

// Reset position due to: https://github.com/vueuse/vueuse/issues/2888
watch(list, () => scrollTo(0))

function scrollToSelectedSong() {
  const idx = list.value.findIndex((el) => el.id === props.selectedSong?.id)
  if (idx === -1) return
  scrollTo(idx)
}

onMounted(() => {
  scrollToSelectedSong()
})

watch(
  () => props.selectedSong,
  () => {
    scrollToSelectedSong()
  }
)
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
        :is-selected="data.id === selectedSong?.id"
        @click="$emit('select-song', index)"
      />
    </div>
  </div>
</template>
