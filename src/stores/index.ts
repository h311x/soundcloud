import { Store } from 'tauri-plugin-store-api'
import { add, isBefore } from 'date-fns'

export const store = new Store('sc.dat')

export async function fetchOrGetFromCache<T extends (...args: any) => unknown>(
  key: string,
  fetcher: T,
  forceRefetch?: boolean
): Promise<Awaited<ReturnType<T>>> {
  const lfKey = `${key}/lastFetched`
  const [hasValue, lastFetched] = await Promise.all([
    store.has(key),
    store.get(lfKey) as Promise<string>
  ])

  if (
    !hasValue ||
    !lastFetched ||
    (lastFetched && isBefore(new Date(lastFetched), new Date())) ||
    forceRefetch
  ) {
    console.time(`Fetching: ${key}`)
    const r = await fetcher()
    await Promise.all([
      store.set(key, r),
      store.set(lfKey, add(new Date(), { minutes: 60 }).toUTCString())
    ])
    await store.save()
    console.timeEnd(`Fetching: ${key}`)

    return r as Awaited<ReturnType<T>>
  }
  return (await store.get(key)) as Awaited<ReturnType<T>>
}
