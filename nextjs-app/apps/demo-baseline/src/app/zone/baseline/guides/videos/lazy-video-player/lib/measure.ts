import { LOG_ROUTE, VIDEO_ROUTE, type RequestRecord, type Snapshot } from '../types'

function playedSeconds(video: HTMLVideoElement | null): number {
  if (!video) return 0
  let total = 0
  for (let i = 0; i < video.played.length; i++) total += video.played.end(i) - video.played.start(i)
  return Math.round(total * 100) / 100
}

/** 브라우저(DOM, Resource Timing)와 서버(요청 기록)를 동시에 읽어 한 시점의 스냅샷을 만든다. */
export async function takeSnapshot(seq: number, video: HTMLVideoElement | null, run: string): Promise<Snapshot> {
  const res = await fetch(`${LOG_ROUTE}?run=${run}`, { cache: 'no-store' })
  const { requests } = (await res.json()) as { requests: RequestRecord[] }

  const marker = `${VIDEO_ROUTE}?run=${run}`
  const browserRequests = performance.getEntriesByType('resource').filter((e) => e.name.includes(marker)).length
  const hasSrc = Boolean(video?.getAttribute('src'))

  return {
    seq,
    phase: hasSrc ? 'after' : 'before',
    measuredAt: new Date().toLocaleTimeString('ko-KR'),
    hasSrc,
    preload: video?.getAttribute('preload') ?? '-',
    readyState: video?.readyState ?? -1,
    networkState: video?.networkState ?? -1,
    paused: video ? video.paused : null,
    muted: video ? video.muted : null,
    currentTime: video ? Math.round(video.currentTime * 100) / 100 : 0,
    playedSeconds: playedSeconds(video),
    browserRequests,
    serverRequests: requests.length,
    serverStatuses: requests.map((r) => r.status),
    rangeRequests: requests.filter((r) => r.range !== null).length,
  }
}
