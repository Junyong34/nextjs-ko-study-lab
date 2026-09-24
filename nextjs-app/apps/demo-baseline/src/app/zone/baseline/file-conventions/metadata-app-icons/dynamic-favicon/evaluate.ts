import { EXPECTED_ICONS, SEGMENT_PATH, type IconSpec } from './specs'
import type { MeasuredIcon, ProbeSnapshot } from './types'

export interface CheckLine {
  label: string
  ok: boolean
  observed: string
}

export interface Evaluation {
  isMatched: boolean
  lines: CheckLine[]
}

export function expectedPath(spec: IconSpec): string {
  return spec.rel === 'icon' ? `${SEGMENT_PATH}/icon/${spec.id}` : `${SEGMENT_PATH}/apple-icon`
}

function describe(icon: MeasuredIcon | undefined): string {
  if (!icon) return '링크 없음'
  const { link, query, result } = icon
  const dims = result.naturalWidth !== null ? `${result.naturalWidth}x${result.naturalHeight}` : '디코딩 실패'
  return `${link.inHead ? 'head' : 'body'} · sizes=${link.sizes ?? '없음'} · type=${link.type ?? '없음'} · 해시=${query || '없음'} · ${result.status ?? 'ERR'} ${result.contentType ?? ''} · ${dims}`
}

function checkIcon(spec: IconSpec, icons: MeasuredIcon[]): CheckLine {
  const path = expectedPath(spec)
  const icon = icons.find((i) => i.link.rel === spec.rel && i.pathname === path)
  const sizes = `${spec.width}x${spec.height}`
  const ok =
    !!icon &&
    icon.link.inHead &&
    icon.link.sizes === sizes &&
    icon.link.type === spec.contentType &&
    icon.query.length > 1 &&
    icon.result.status === 200 &&
    (icon.result.contentType ?? '').startsWith(spec.contentType) &&
    icon.result.naturalWidth === spec.width &&
    icon.result.naturalHeight === spec.height
  return {
    label: `${spec.source}${spec.id ? ` (id: ${spec.id})` : ''} → rel="${spec.rel}" ${sizes}`,
    ok,
    observed: describe(icon),
  }
}

export function evaluate(snapshot: ProbeSnapshot | null): Evaluation | null {
  if (!snapshot) return null
  const lines = EXPECTED_ICONS.map((spec) => checkIcon(spec, snapshot.icons))

  const leaked = snapshot.noResetLinks?.filter((l) => l.href.includes(SEGMENT_PATH)) ?? []
  lines.push({
    label: 'no-reset 하위 라우트 → 이 세그먼트의 파일 아이콘 링크 0개',
    ok: snapshot.noResetLinks !== null && leaked.length === 0,
    observed: snapshot.noResetLinks
      ? `아이콘 링크 ${snapshot.noResetLinks.length}개 (${snapshot.noResetLinks.map((l) => l.href).join(', ') || '없음'}), 파일 아이콘 ${leaked.length}개`
      : `측정 실패: ${snapshot.noResetError}`,
  })

  return { isMatched: lines.every((l) => l.ok), lines }
}
