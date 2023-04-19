<script setup lang="ts">
import TrackItem from './TrackItem.vue'
import useVirtualList from '../composables/useVirtualList'
import { toRefs, watch } from 'vue'
import { Song } from '../utils'

const props = defineProps<{ list: Song[]; selectedSong: Song }>()
defineEmits<{
  (e: 'select-song', v: number): void
}>()
const { list, selectedSong } = toRefs(props)

const [rowVirtualizer, listRef] = useVirtualList(list, (idx) => list.value[idx].id.toString() ?? '')

watch(selectedSong, (v) => {
  const idx = list.value.findIndex((el) => el.id === v?.id)
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
      :item="list[virtualItem.index]"
      :item-index="virtualItem.index"
      :is-selected="list[virtualItem.index].id === selectedSong?.id"
      @select-song="$emit('select-song', virtualItem.index)"
    />
  </div>
</template>
