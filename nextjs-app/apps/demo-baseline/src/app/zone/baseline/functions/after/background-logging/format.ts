/** 밀리초 단위까지 표시하는 시각 포맷터. 두 서버 타임스탬프의 실제 선후 관계를 눈으로 비교하려면 초 단위로는 부족하다. */
export function formatTimestamp(ts: number | null): string {
  if (ts === null) return '—'
  const d = new Date(ts)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  const ms = String(d.getMilliseconds()).padStart(3, '0')
  return `${hh}:${mm}:${ss}.${ms}`
}
