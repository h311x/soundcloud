<script setup lang="ts">
import { provide, shallowRef, watch } from 'vue'
import { Song } from '../../utils'
import { usePlaylist } from '../../composables/usePlaylist'
import { key } from '../../composables/useGlobalControls'
import { useNotifications } from '../../composables/useNotifications'

const currentPlaylist = shallowRef<Song[]>([])
const playlistControls = usePlaylist(currentPlaylist)

provide(key, playlistControls)

const { check, send } = useNotifications()

await check()

watch(playlistControls.controls.playing, (v) => {
  if (!v) return
  send({
    title: playlistControls.selectedSong.value?.title ?? '',
    body: playlistControls.selectedSong.value?.username
  })
})
</script>

<template>
  <slot />
</template>
