<script setup lang="ts">
import { provide, shallowRef } from 'vue'
import { Song } from '../../utils'
import { usePlaylist } from '../../composables/usePlaylist'
import { key } from '../../composables/useGlobalControls'

const currentPlaylist = shallowRef<Song[]>([])
const playlistControls = usePlaylist(currentPlaylist)

provide(key, playlistControls)
</script>

<template>
  <slot />
</template>
