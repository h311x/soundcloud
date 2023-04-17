import { useEventListener, useMediaControls } from '@vueuse/core'
import { Ref, computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import SoundCloudAPI, { Song } from '../lib/soundcloud'
import Hls from 'hls.js'

export const usePlaylist = (list: Ref<Song[]>) => {
  const api = new SoundCloudAPI()
  const audio = ref(new Audio())
  const hls = new Hls()

  onUnmounted(() => {
    hls.destroy()
  })

  // hls.on(Hls.Events.MEDIA_ATTACHED, function () {
  //   console.log('audio and hls.js are now bound together !')
  // })

  hls.on(Hls.Events.ERROR, function (event, data) {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          console.log('fatal network error encountered, try to recover')
          hls.startLoad()
          break
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log('fatal media error encountered, try to recover')
          hls.recoverMediaError()
          break
        default:
          console.log('Unrecoverable error: ', { data }, { event })
          console.log('Trying to play next...')
          playNext()
          break
      }
    }
  })

  const selectedSongIdx = ref(0)
  const selectedSong = computed(() => list.value.at(selectedSongIdx.value))

  const controls = useMediaControls(audio)

  useEventListener(document, 'keydown', (e) => {
    if (e.code === 'Space' && document.activeElement === document.body) {
      e.preventDefault()
      controls.playing.value = !controls.playing.value
    }
  })

  watch(controls.ended, (v) => {
    if (!v) return
    playNext()
  })

  async function preloadAudio(idx: number) {
    const track = list.value.at(idx)!
    // console.log(track)
    // return
    const s = await api.getStreamLink(track.media)
    hls.loadSource(s)

    setMediaMetadata(idx)
  }

  onMounted(() => {
    hls.attachMedia(audio.value)
    preloadAudio(0)
  })

  function setMediaMetadata(idx: number) {
    const track = list.value.at(idx)!

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.username,
      artwork: ['500'].map((el) => ({
        src: track.artwork_url ?? '',
        sizes: `${el}x${el}`
      }))
    })
  }

  async function pickSong(idx: number) {
    controls.playing.value = false
    controls.currentTime.value = 0
    selectedSongIdx.value = idx

    await preloadAudio(idx)
    await nextTick()

    controls.playing.value = true
  }

  function playNext() {
    // if (selectedSongIdx.value + 1 === list.value.length) return
    pickSong((selectedSongIdx.value + 1) % list.value.length)
  }

  function playPrev() {
    // if (selectedSongIdx.value - 1 === -1) return
    pickSong((selectedSongIdx.value - 1) % list.value.length)
  }

  // #region Meta Stuff
  watch(controls.playing, (v) => {
    navigator.mediaSession.playbackState = v ? 'playing' : 'paused'
  })

  function updatePositionState(position: number, duration: number) {
    navigator.mediaSession.setPositionState({
      duration,
      position,
      playbackRate: 1
    })
  }

  watch(
    () => [controls.currentTime.value, controls.duration.value],
    ([pos, dur]) => {
      if (pos && dur) updatePositionState(pos, dur)
    }
  )

  const actionHandlers = [
    // play
    [
      'play',
      () => {
        controls.playing.value = true
      }
    ],
    [
      'pause',
      () => {
        controls.playing.value = false
      }
    ],
    [
      'nexttrack',
      () => {
        playNext()
      }
    ],
    [
      'previoustrack',
      () => {
        playPrev()
      }
    ]
  ] satisfies [MediaSessionAction, MediaSessionActionHandler][]

  onMounted(() => {
    for (const [action, handler] of actionHandlers) {
      navigator.mediaSession.setActionHandler(action, handler)
    }
  })

  onUnmounted(() => {
    for (const [action] of actionHandlers) {
      navigator.mediaSession.setActionHandler(action, null)
    }
  })
  // #endregion

  return {
    controls,
    pickSong,
    playNext,
    playPrev,
    selectedSong
  }
}
