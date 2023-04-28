import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import { usePlaylist } from './usePlaylist'
import { Song } from '../utils'
import { PlaylistType } from '../lib/playlistType'

export const key = Symbol() as InjectionKey<ReturnType<typeof usePlaylist>>

export function useGlobalControls() {
  const t = inject(key)
  if (!t) {
    throw new Error('Wrap the app with <GlobalControlsProvider/>')
  }

  const setPlaylist = (p: Song[], playlistType: PlaylistType) => {
    t.currentPlaylist.value = p
    t.selectedPlaylistType.value = playlistType
  }

  return [t, setPlaylist] as const
}
