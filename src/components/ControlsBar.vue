<script setup lang="ts">
import Button from './ui/Button'
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/vue/20/solid'
import { useGlobalControls } from '../composables/useGlobalControls'
import { computed } from 'vue'
import TypographyLarge from './typography/TypographyLarge.vue'
import TypographySmall from './typography/TypographySmall.vue'

const [{ controls, playNext, playPrev, play, pause, selectedSong }] = useGlobalControls()

const size = computed(() => (controls.currentTime.value / (controls.duration.value + 1)) * 100)
</script>

<template>
  <div class="px-4 py-2 w-full">
    <div v-if="selectedSong" class="mb-3 flex gap-4">
      <img class="w-12 h-12" :src="selectedSong.artwork_url" />

      <div>
        <TypographyLarge>
          {{ selectedSong.title }}
        </TypographyLarge>

        <TypographySmall>
          {{ selectedSong.username }}
        </TypographySmall>
      </div>
    </div>

    <div class="flex gap-4">
      <div class="flex gap-4">
        <Button variant="outline" @click="playPrev">
          <BackwardIcon class="w-5 h-5" />
        </Button>
        <Button variant="outline" @click="controls.playing.value ? pause() : play()">
          <Component class="w-5 h-5" :is="controls.playing.value ? PauseIcon : PlayIcon" />
        </Button>
        <Button variant="outline" @click="playNext">
          <ForwardIcon class="w-5 h-5" />
        </Button>
      </div>
      <div class="w-full flex items-center">
        <div class="w-full bg-slate-200 h-1 rounded">
          <div class="bg-slate-600 h-1 rounded" :style="{ width: `${size}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>
