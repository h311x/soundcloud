import Hls from 'hls.js'
import { onUnmounted } from 'vue'

export function useHls({ onError }: { onError: () => void }) {
  const hls = new Hls()
  onUnmounted(() => {
    hls.destroy()
  })

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
          onError()
          break
      }
    }
  })

  return hls
}
