<script setup lang="ts">
import TypographyH3 from '../components/typography/TypographyH3.vue'
import TracksList from '../components/TracksList.vue'
import { PlaylistType } from '../lib/playlistType'
import Button from '../components/ui/Button.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import { useWeeklyStore } from '../stores/weekly'

const { playlist, refetch, isRefetching } = await useWeeklyStore()
</script>

<template>
  <div class="flex flex-col">
    <div class="p-5 flex justify-between items-center">
      <TypographyH3>{{ playlist.title }}</TypographyH3>

      <Button @click="refetch()" variant="ghost">
        <ArrowPathIcon class="w-5 h-5" :class="{ 'animate-spin': isRefetching }" />
      </Button>
    </div>

    <TracksList :list="playlist.tracks" :playlistType="PlaylistType.Weekly" />
  </div>
</template>
