import {
  isPermissionGranted,
  Options,
  requestPermission,
  sendNotification
} from '@tauri-apps/api/notification'
import { ref } from 'vue'

export function useNotifications() {
  const permissionGranted = ref(false)
  async function check() {
    permissionGranted.value = await isPermissionGranted()
    if (!permissionGranted.value) {
      const permission = await requestPermission()
      permissionGranted.value = permission === 'granted'
    }
  }

  async function send(v: Options) {
    await check()
    if (permissionGranted.value) {
      sendNotification(v)
    }
  }

  return {
    check,
    send
  }
}
