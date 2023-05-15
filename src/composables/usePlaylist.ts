import { useEventListener, useMediaControls } from '@vueuse/core'
import { Ref, computed, nextTick, ref, watch } from 'vue'
import SoundCloudAPI from '../lib/soundcloud'
import { Song } from '../utils'
import { useMediaSession } from './useMediaSession'
import { useHls } from './useHls'
import { PlaylistType } from '../lib/playlistType'

export const usePlaylist = (list: Ref<Song[]>) => {
  const api = new SoundCloudAPI()
  const audio = ref(new Audio())
  const controls = useMediaControls(audio)
  const hls = useHls({ onError: playNext })
  hls.attachMedia(audio.value)

  const selectedPlaylistType = ref<PlaylistType | undefined>()
  const selectedSongIdx = ref(0)
  const selectedSong = computed(() => list.value.at(selectedSongIdx.value))

  function play() {
    controls.playing.value = true
  }

  function pause() {
    controls.playing.value = false
  }

  async function pickSong(idx: number) {
    pause()
    controls.currentTime.value = 0
    selectedSongIdx.value = idx

    await preloadAudio(idx)
    await nextTick()

    play()
  }

  function playPrev() {
    if (controls.currentTime.value <= 5) {
      pickSong((selectedSongIdx.value - 1) % list.value.length)
    } else {
      controls.currentTime.value = 0
    }
  }

  function playNext() {
    try {
      pickSong((selectedSongIdx.value + 1) % list.value.length)
    } catch (e) {
      console.log('type error?', e)
    }
  }

  const { setMediaMetadata } = useMediaSession(controls, [playPrev, playNext, play, pause])

  async function preloadAudio(idx: number) {
    const track = list.value.at(idx)!
    const s = await api.getStreamLink(track.media)
    hls.loadSource(s)

    setMediaMetadata(track)
  }

  // Handle pressing on spacebar when focused on window
  useEventListener(document, 'keydown', (e) => {
    if (
      e.code === 'Space' &&
      document.activeElement &&
      !['INPUT', 'BUTTON', 'TEXTAREA'].includes(document.activeElement.tagName)
    ) {
      e.preventDefault()
      controls.playing.value ? pause() : play()
    }
  })

  // Play next song if current one ended
  watch(controls.ended, (v) => {
    if (!v) return
    playNext()
  })

  return {
    controls,
    play,
    pause,
    pickSong,
    playNext,
    playPrev,
    selectedSong,
    selectedPlaylistType,
    preloadAudio,
    currentPlaylist: list
  }
}
