import { useEventListener, useMediaControls } from '@vueuse/core'
import { Ref, computed, nextTick, onMounted, ref, watch } from 'vue'
import SoundCloudAPI from '../lib/soundcloud'
import { Song } from '../utils'
import { useMediaSession } from './useMediaSession'
import { useHls } from './useHls'

export const usePlaylist = (list: Ref<Song[]>) => {
  const api = new SoundCloudAPI()
  const audio = ref(new Audio())
  const controls = useMediaControls(audio)
  const hls = useHls({ onError: playNext })

  const selectedSongIdx = ref(0)
  const selectedSong = computed(() => list.value.at(selectedSongIdx.value)!)

  async function pickSong(idx: number) {
    controls.playing.value = false
    controls.currentTime.value = 0
    selectedSongIdx.value = idx

    await preloadAudio(idx)
    await nextTick()

    controls.playing.value = true
  }

  function playPrev() {
    pickSong((selectedSongIdx.value - 1) % list.value.length)
  }

  function playNext() {
    pickSong((selectedSongIdx.value + 1) % list.value.length)
  }

  const { setMediaMetadata } = useMediaSession(controls, [playPrev, playNext])

  async function preloadAudio(idx: number) {
    const track = list.value.at(idx)!
    const s = await api.getStreamLink(track.media)
    hls.loadSource(s)

    setMediaMetadata(track)
  }

  // Preload first song when opened
  onMounted(() => {
    hls.attachMedia(audio.value)
    preloadAudio(0)
  })

  // Handle pressing on spacebar when focused on window
  useEventListener(document, 'keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === document.body) {
      e.preventDefault()
      controls.playing.value = !controls.playing.value
    }
  })

  // Play next song if current one ended
  watch(controls.ended, (v) => {
    if (!v) return
    playNext()
  })

  return {
    controls,
    pickSong,
    playNext,
    playPrev,
    selectedSong
  }
}
