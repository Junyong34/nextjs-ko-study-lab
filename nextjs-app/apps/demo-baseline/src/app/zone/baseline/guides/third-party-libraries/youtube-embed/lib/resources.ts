import { FACADE_HOSTS, type RequestTally } from '../types'

// 라이트 임베드가 클릭 뒤 만드는 플레이어: youtube-nocookie.com iframe(Safari·모바일은 youtube.com/iframe_api 추가)
export function isLitePlayer(u: URL): boolean {
  return u.host.endsWith('youtube-nocookie.com') || (u.host.endsWith('youtube.com') && !u.pathname.startsWith('/embed/'))
}

// 대조군 일반 iframe이 바로 요청하는 플레이어 문서
export function isControlPlayer(u: URL): boolean {
  return u.host === 'www.youtube.com' && u.pathname.startsWith('/embed/')
}

/**
 * [from, to) 구간에 시작된 외부 요청을 센다.
 * 부모 문서의 resource 타임라인에는 iframe 문서 요청까지만 남는다. iframe 안 플레이어 JS·CSS는
 * 교차 출처 iframe 자신의 타임라인에 기록되므로 여기서는 보이지 않는다(DevTools Network에서는 보인다).
 */
export function tally(
  from: number,
  to: number,
  isPlayer: (u: URL) => boolean,
  // 같은 시간대에 다른 임베드가 만든 요청을 빼기 위한 필터
  exclude: (u: URL) => boolean = () => false,
): RequestTally {
  const byHost: Record<string, number> = {}
  let player = 0
  for (const e of performance.getEntriesByType('resource')) {
    if (e.startTime < from || e.startTime >= to) continue
    const u = new URL(e.name)
    if (u.host === location.host || exclude(u)) continue
    byHost[u.host] = (byHost[u.host] ?? 0) + 1
    if (isPlayer(u)) player += 1
  }
  return { byHost, player }
}

export function formatHosts(byHost: Record<string, number>): string {
  const rows = Object.entries(byHost)
  return rows.length === 0 ? '0건' : rows.map(([h, n]) => `${h} ${n}건`).join(' · ')
}

// 라이트 임베드 쪽 요청(facade 자산 + nocookie 플레이어): 대조군 집계에서 뺀다
export function isLiteRelated(u: URL): boolean {
  return FACADE_HOSTS.includes(u.host) || isLitePlayer(u)
}
