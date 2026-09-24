import type { ImgProbe, SrcsetCandidate } from '../types'

/** 렌더된 srcset 속성 문자열을 후보 배열로 파싱한다(이 데모의 URL에는 콤마가 없다). */
export function parseSrcset(srcset: string | null): SrcsetCandidate[] {
  if (!srcset) return []
  return srcset
    .split(',')
    .map((part) => part.trim().split(/\s+/))
    .filter((tokens) => tokens.length === 2)
    .map(([url, descriptor]) => ({
      url,
      value: Number.parseFloat(descriptor),
      kind: descriptor.endsWith('x') ? ('x' as const) : ('w' as const),
    }))
}

/**
 * sizes 속성을 브라우저가 쓰는 방식 그대로 평가한다: (미디어 조건) 길이 쌍을 순서대로 matchMedia로
 * 검사하고, 처음 일치한 길이(없으면 마지막 기본값)를 실제 CSS width로 적용해 px로 잰다.
 */
export function evaluateSizes(sizes: string): number | null {
  const parts = sizes.split(/,(?![^(]*\))/).map((p) => p.trim()).filter(Boolean)
  let length: string | null = null
  for (const part of parts) {
    if (part.startsWith('(')) {
      const close = part.indexOf(')')
      if (window.matchMedia(part.slice(0, close + 1)).matches) {
        length = part.slice(close + 1).trim()
        break
      }
    } else {
      length = part
      break
    }
  }
  if (!length) return null
  const probe = document.createElement('div')
  probe.style.cssText = `position:absolute;visibility:hidden;height:0;width:${length}`
  document.body.appendChild(probe)
  const px = probe.getBoundingClientRect().width
  probe.remove()
  return Math.round(px * 100) / 100
}

/** 이 후보가 필요 해상도를 채우는지 판단할 기준값: w 서술자면 슬롯폭×DPR(px), x 서술자면 DPR. */
export function neededValue(probe: ImgProbe): number | null {
  const kind = probe.candidates[0]?.kind
  if (kind === 'x') return probe.dpr
  if (kind === 'w' && probe.slotWidth !== null) return probe.slotWidth * probe.dpr
  return null
}

/**
 * 브라우저 선택의 허용 하한. 스펙은 정확한 선택 규칙을 UA에 맡기고(Chromium은 인접 후보 사이
 * 기하평균 등을 쓴다), 이미 받은 더 큰 후보는 축소 시 그대로 쓴다. 그래서 "필요값 이상인 가장 작은
 * 후보"의 바로 아래 후보까지를 정상 선택으로 본다.
 */
export function lowestAcceptable(candidates: SrcsetCandidate[], need: number): number {
  const sorted = [...candidates].sort((a, b) => a.value - b.value)
  const idx = sorted.findIndex((c) => c.value >= need)
  if (idx === -1) return sorted[sorted.length - 1]?.value ?? 0
  return sorted[Math.max(0, idx - 1)].value
}

export function widthParam(url: string): number | null {
  const w = new URL(url, window.location.href).searchParams.get('w')
  return w === null ? null : Number(w)
}
