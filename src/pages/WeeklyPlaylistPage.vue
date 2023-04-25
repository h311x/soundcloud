<script setup lang="ts">
import TypographyH3 from '../components/typography/TypographyH3.vue'
import { ref, shallowRef } from 'vue'
import { fetchWeekly } from '../stores'
import TracksList from '../components/TracksList.vue'
import { PlaylistType } from '../lib/playlistType'
import Button from '../components/ui/Button'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'

const playlist = shallowRef(await fetchWeekly())

const isFetching = ref(false)

async function refetch() {
  isFetching.value = true
  try {
    playlist.value = await fetchWeekly(true)
  } catch (e) {
    // TODO: Handle Errors Better
    console.error('Could not refetch', e)
  } finally {
    isFetching.value = false
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div class="p-5 flex justify-between items-center">
      <TypographyH3>{{ playlist.title }}</TypographyH3>

      <Button @click="refetch" variant="ghost">
        <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isFetching }" />
      </Button>
    </div>

    <TracksList :list="playlist.tracks" :playlistType="PlaylistType.Weekly" />
  </div>
</template>
