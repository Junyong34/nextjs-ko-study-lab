import type { ReceivedBeacon } from '../types'

// 데모용 메모리 저장소. 서버 프로세스마다 따로 존재하므로 서버리스 배포에서는 인스턴스 간에 공유되지 않는다.
// dev의 HMR로 모듈이 다시 로드돼도 유지되도록 globalThis에 둔다.
const g = globalThis as unknown as { __customBeaconStore?: ReceivedBeacon[] }
const store = (g.__customBeaconStore ??= [])

export function listBeacons(): ReceivedBeacon[] {
  return [...store]
}

export function addBeacon(item: ReceivedBeacon) {
  store.unshift(item)
  store.length = Math.min(store.length, 20)
}

export function clearBeacons() {
  store.length = 0
}
