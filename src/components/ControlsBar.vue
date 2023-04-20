<script setup lang="ts">
import Button from './ui/Button'
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/vue/20/solid'

defineProps<{ size: number; isPlaying: boolean }>()

defineEmits<{
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'next'): void
  (e: 'prev'): void
}>()
</script>

<template>
  <div class="px-4 py-2 w-full flex gap-4">
    <div class="flex gap-4">
      <Button variant="outline" @click="$emit('prev')">
        <BackwardIcon class="w-5 h-5" />
      </Button>
      <Button variant="outline" @click="$emit(isPlaying ? 'pause' : 'play')">
        <Component class="w-5 h-5" :is="isPlaying ? PauseIcon : PlayIcon" />
      </Button>
      <Button variant="outline" @click="$emit('next')">
        <ForwardIcon class="w-5 h-5" />
      </Button>
    </div>
    <div class="w-full flex items-center">
      <div class="w-full bg-slate-200 h-1 rounded">
        <div class="bg-slate-600 h-1 rounded" :style="{ width: `${size}%` }" />
      </div>
    </div>
  </div>
</template>
