import type { CaseVerdict, ImgProbe, SizesPreset } from '../types'
import { DEVICE_SIZES, IMAGE_SIZES } from './imageSetup'
import { lowestAcceptable, neededValue, widthParam } from './srcset'

const APP_ORIGINAL_WIDTH = 1600
const FIXED_EXPECTED = [384, 640] // width=320 → [320, 640]을 allSizes에서 올림: 384(1x), 640(2x)

/**
 * get-img-props.js getWidths()를 읽고 정리한 기대 후보 목록(공식 문서 sizes 절과 동일한 결론):
 * sizes가 있으면 allSizes 중 deviceSizes[0] × (가장 작은 vw 비율) 이상, 없으면 deviceSizes 전체.
 */
export function expectedFillWidths(sizes: string | undefined): number[] {
  if (!sizes) return [...DEVICE_SIZES]
  const vws = [...sizes.matchAll(/(^|\s)(1?\d?\d)vw/g)].map((m) => Number(m[2]))
  const all = [...DEVICE_SIZES, ...IMAGE_SIZES].sort((a, b) => a - b)
  if (vws.length === 0) return all
  const min = DEVICE_SIZES[0] * (Math.min(...vws) / 100)
  return all.filter((w) => w >= min)
}

const px = (n: number | null) => (n === null ? '측정 중' : `${n}px`)
const isFillBox = (p: ImgProbe) =>
  p.position === 'absolute' && Math.abs(p.boxWidth - p.parentWidth) < 1 && Math.abs(p.boxHeight - p.parentHeight) < 1

function choiceLines(p: ImgProbe) {
  const need = neededValue(p)
  const floor = need === null ? null : lowestAcceptable(p.candidates, need)
  const unit = p.candidates[0]?.kind ?? 'w'
  const ok = p.chosen !== null && floor !== null && p.chosen.value >= floor
  const smallestEnough = need === null ? null : p.candidates.find((c) => c.value >= need)?.value
  const oversized = ok && smallestEnough != null && (p.chosen?.value ?? 0) > smallestEnough
  const text =
    `• 필요값: ${need === null ? '-' : unit === 'w' ? `슬롯 ${p.slotWidth}px × DPR ${p.dpr} = ${Math.round(need)}w` : `DPR ${p.dpr}x`}\n` +
    `• 선택된 후보: ${p.chosen ? `${p.chosen.value}${p.chosen.kind}` : 'srcset에 없음'} (허용 하한 ${floor ?? '-'}${unit})` +
    (oversized ? `\n  └ 필요보다 큼: 창을 줄이기 전에 받은 후보를 브라우저가 재사용 중일 수 있음 → [캐시 없이 다시 요청]` : '')
  return { ok, text }
}

export function judgeAppImage(p: ImgProbe): CaseVerdict {
  const noW = widthParam(p.currentSrc) === null
  const matched =
    p.srcsetAttr === null && p.sizesAttr === null && noW && p.fileWidth === APP_ORIGINAL_WIDTH && isFillBox(p)
  return {
    id: 'appImage',
    title: 'A. 이 앱의 <Image fill sizes loader>',
    expected: `• srcset·sizes 속성 없음 (config.unoptimized가 prop보다 우선)\n• loader 미호출 → currentSrc에 w 없음, 원본 ${APP_ORIGINAL_WIDTH}px\n• position:absolute, 박스 = 부모 박스`,
    actual:
      `• srcset: ${p.srcsetAttr ?? '없음'} / sizes: ${p.sizesAttr ?? '없음'}\n` +
      `• currentSrc w: ${noW ? '없음' : widthParam(p.currentSrc)} / 파일 폭 ${px(p.fileWidth)}\n` +
      `• position:${p.position}, 박스 ${p.boxWidth}×${p.boxHeight} / 부모 ${p.parentWidth}×${p.parentHeight}`,
    matched,
  }
}

export function judgeOptimizedFill(p: ImgProbe, preset: SizesPreset): CaseVerdict {
  const expectedSizes = preset.sizes ?? '100vw'
  const expectedWidths = expectedFillWidths(preset.sizes)
  const actualWidths = p.candidates.map((c) => `${c.value}${c.kind}`).join(' ')
  const choice = choiceLines(p)
  const matched =
    p.sizesAttr === expectedSizes &&
    actualWidths === expectedWidths.map((w) => `${w}w`).join(' ') &&
    choice.ok &&
    p.fileWidth === p.chosen?.value &&
    isFillBox(p)
  return {
    id: 'optimizedFill',
    title: 'B. unoptimized:false 로 만든 fill + sizes',
    expected:
      `• sizes="${expectedSizes}"${preset.sizes ? '' : ' (생략 시 자동)'}\n` +
      `• w 후보 ${expectedWidths.length}개: ${expectedWidths.join(' ')}\n` +
      `• 선택 후보 ≥ 필요값 바로 아래 후보, 파일 폭 = 선택 w\n• position:absolute, 박스 = 부모 박스`,
    actual:
      `• sizes="${p.sizesAttr ?? ''}"\n• 후보 ${p.candidates.length}개: ${actualWidths}\n${choice.text}\n` +
      `• 파일 폭 ${px(p.fileWidth)} / naturalWidth ${p.naturalWidth} (밀도 보정값)\n` +
      `• position:${p.position}, 박스 ${p.boxWidth}×${p.boxHeight}`,
    matched,
  }
}

export function judgeFixedWidth(p: ImgProbe): CaseVerdict {
  const actualWidths = p.candidates.map((c) => `${widthParam(c.url)}@${c.value}${c.kind}`).join(' ')
  const choice = choiceLines(p)
  const chosenFile = p.chosen ? widthParam(p.chosen.url) : null
  const matched =
    p.sizesAttr === null &&
    actualWidths === `${FIXED_EXPECTED[0]}@1x ${FIXED_EXPECTED[1]}@2x` &&
    choice.ok &&
    p.fileWidth === chosenFile
  return {
    id: 'fixedWidth',
    title: 'C. width={320}, sizes 없음 (고정 크기)',
    expected: `• sizes 속성 없음\n• x 후보 2개: ${FIXED_EXPECTED[0]}@1x ${FIXED_EXPECTED[1]}@2x (뷰포트 무관, DPR만으로 선택)\n• 파일 폭 = 선택 후보의 w`,
    actual: `• sizes: ${p.sizesAttr ?? '없음'}\n• 후보: ${actualWidths}\n${choice.text}\n• 파일 폭 ${px(p.fileWidth)}`,
    matched,
  }
}
