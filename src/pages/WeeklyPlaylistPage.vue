<script setup lang="ts">
import TypographyH3 from '../components/typography/TypographyH3.vue'
import SoundCloudAPI from '../lib/soundcloud'
import { shallowRef } from 'vue'
import { fetchOrGetFromCache } from '../stores'
import TracksList from '../components/TracksList.vue'
import { PlaylistType } from '../lib/playlistType.ts'

const sc = new SoundCloudAPI()

const playlist = shallowRef(await fetchOrGetFromCache('weeklyPlaylist', () => sc.getWeekly()))
</script>

<template>
  <div class="flex flex-col">
    <div class="p-5">
      <TypographyH3>{{ playlist.title }}</TypographyH3>
    </div>

    <TracksList :list="playlist.tracks" :playlistType="PlaylistType.Weekly" />
  </div>
</template>
