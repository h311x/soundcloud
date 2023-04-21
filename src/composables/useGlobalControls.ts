import { provide, inject, shallowRef } from 'vue'
import type { InjectionKey } from 'vue'
import { usePlaylist } from './usePlaylist'
import { Song } from '../utils'

const key = Symbol() as InjectionKey<[ReturnType<typeof usePlaylist>, (p: Song[]) => void]>

export function createGlobalControls() {
  const currentPlaylist = shallowRef<Song[]>([])

  function setPlaylist(p: Song[]) {
    currentPlaylist.value = p
  }

  const playlistControls = usePlaylist(currentPlaylist)

  provide(key, [playlistControls, setPlaylist])

  return [playlistControls, setPlaylist]
}

export function useGlobalControls() {
  const t = inject(key)
  if (!t) {
    throw new Error('createGlobalControls was not called')
  }

  return t
}
