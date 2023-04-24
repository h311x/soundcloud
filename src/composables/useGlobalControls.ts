import { provide, inject, shallowRef } from 'vue'
import type { InjectionKey } from 'vue'
import { usePlaylist } from './usePlaylist'
import { Song } from '../utils'
import { PlaylistType } from '../lib/playlistType'

const key = Symbol() as InjectionKey<ReturnType<typeof usePlaylist>>

export function createGlobalControls() {
  const currentPlaylist = shallowRef<Song[]>([])

  const playlistControls = usePlaylist(currentPlaylist)

  provide(key, playlistControls)

  return playlistControls
}

export function useGlobalControls() {
  const t = inject(key)
  if (!t) {
    throw new Error('createGlobalControls was not called')
  }

  const setPlaylist = (p: Song[], playlistType: PlaylistType) => {
    t.currentPlaylist.value = p
    t.selectedPlaylistType.value = playlistType
  }

  return [t, setPlaylist] as const
}
