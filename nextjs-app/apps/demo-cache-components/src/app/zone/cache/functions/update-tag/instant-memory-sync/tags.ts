import type { InvalidationApi, LineId } from './types'

// 태그는 앱 전역이므로 데모 접두사를 붙인다 (apps/AGENTS.md 8항)
const PREFIX = 'functions-update-tag-instant-memory-sync'

export const LINE_IDS: LineId[] = ['update', 'revalidate']

export const LINES: Record<LineId, { name: string; api: InvalidationApi; tag: string }> = {
  update: { name: '노이즈캔슬링 무선 이어폰', api: 'updateTag', tag: `${PREFIX}:cart-line:update` },
  revalidate: {
    name: '고속 충전 USB-C 케이블',
    api: "revalidateTag(tag, 'max')",
    tag: `${PREFIX}:cart-line:revalidate`,
  },
}

/** 캐시 생성/원본 변경 시각: 비교용 epoch ms + 표시용 HH:mm:ss.SSS(UTC) */
export function nowStamp() {
  const ms = Date.now()
  return { ms, label: new Date(ms).toISOString().slice(11, 23) }
}
