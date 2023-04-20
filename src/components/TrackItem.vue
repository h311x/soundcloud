<script setup lang="ts">
import { Song } from '../utils'

defineProps<{
  item: Song
  itemIndex: number
  isSelected: boolean
}>()

defineEmits<{
  (e: 'selectSong', idx: number): void
}>()
</script>

<template>
  <div
    class="flex gap-4 hover:bg-white/10 cursor-pointer w-full"
    :class="{ 'bg-white/20': isSelected }"
    @click="$emit('selectSong', itemIndex)"
  >
    <div class="border overflow-hidden w-[100px] h-[100px] shrink-0">
      <img
        class="min-w-[100px] min-h-[100px]"
        height="100"
        width="100"
        loading="lazy"
        :src="item.artwork_url"
      />
    </div>
    <div class="py-1">
      <div class="text-xl">
        {{ item.title }}
      </div>
      <div class="font-bold text-sm text-slate-200">
        {{ item.username }}
      </div>
    </div>
  </div>
</template>
