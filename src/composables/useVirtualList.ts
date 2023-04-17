import { useWindowVirtualizer } from '@tanstack/vue-virtual'
import { computed, Ref, ref, watchEffect } from 'vue'

export default function useVirtualList<List extends unknown[]>(
  list: Ref<List>,
  getItemKey: (idx: number) => string | number
) {
  const scrollMargin = ref(0)
  const listRef = ref<HTMLDivElement>()
  const observer = ref<ResizeObserver>()

  const virtualizerOptions = computed(
    () =>
      ({
        count: list.value.length,
        estimateSize: () => 100 + 16,
        getItemKey,
        scrollMargin: scrollMargin.value
      } satisfies Parameters<typeof useWindowVirtualizer>[0])
  )

  const rowVirtualizer = useWindowVirtualizer(virtualizerOptions)

  watchEffect((onCleanup) => {
    const update = () => {
      scrollMargin.value = listRef.value?.offsetTop ?? 0
    }
    observer.value = new ResizeObserver(update)
    update()

    onCleanup(() => observer.value?.disconnect())
  })

  return [rowVirtualizer, listRef] as const
}
