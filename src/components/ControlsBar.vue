<script setup lang="ts">
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  HeartIcon as HeartIconFilled
} from '@heroicons/vue/24/solid'
import { HeartIcon as HeartIconEmpty } from '@heroicons/vue/24/outline'
import { useGlobalControls } from '../composables/useGlobalControls'
import { computed } from 'vue'
import TypographyLarge from './typography/TypographyLarge.vue'
import TypographySmall from './typography/TypographySmall.vue'
import { useLikesStore } from '../stores/likes'
import { open } from '@tauri-apps/api/shell'
import Button from './ui/Button.vue'

const { likeIds } = await useLikesStore()

const [{ controls, playNext, playPrev, play, pause, selectedSong }] = useGlobalControls()

const isCurrentSongLiked = computed(() =>
  selectedSong.value?.id ? likeIds.value.has(selectedSong.value.id) : false
)

const size = computed(() => (controls.currentTime.value / (controls.duration.value + 1)) * 100)

function handleLike() {
  open(selectedSong.value?.songUrl ?? '')
}
</script>

<template>
  <div class="px-4 py-2 w-full">
    <div class="flex justify-between">
      <div v-if="selectedSong" class="mb-3 flex gap-4">
        <img class="w-12 h-12" :src="selectedSong.artworkUrl" />

        <div>
          <TypographyLarge>
            {{ selectedSong.title }}
          </TypographyLarge>

          <TypographySmall>
            {{ selectedSong.username }}
          </TypographySmall>
        </div>
      </div>
      <Button @click="handleLike" variant="ghost">
        <Component class="w-6 h-6" :is="isCurrentSongLiked ? HeartIconFilled : HeartIconEmpty" />
      </Button>
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
