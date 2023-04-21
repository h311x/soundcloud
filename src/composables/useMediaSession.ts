import { useMediaControls } from '@vueuse/core'
import { onMounted, onUnmounted, watch } from 'vue'
import { Song } from '../utils'

export function useMediaSession(
  controls: ReturnType<typeof useMediaControls>,
  [playPrev, playNext, play, pause]: (() => void)[]
) {
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
    [
      'play',
      () => {
        play()
      }
    ],
    [
      'pause',
      () => {
        pause()
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

  function setMediaMetadata(track: Song) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.username,
      artwork: ['500'].map((el) => ({
        src: track.artwork_url ?? '',
        sizes: `${el}x${el}`
      }))
    })
  }

  return {
    setMediaMetadata
  }
}
