import type { CaseVerdict, ImgProbe, SizesPreset } from '../types'
import { ALL_WIDTHS, FIXED_DENSITIES, FIXED_WIDTH } from './imageSetup'
import { lowestAcceptable, neededValue, widthParam } from './srcset'

const APP_ORIGINAL_WIDTH = 1600
const FIXED_EXPECTED = FIXED_DENSITIES.map((d) => `${FIXED_WIDTH * d}@${d}x`).join(' ')

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
    expected: `• srcset·sizes 속성 없음 (images.unoptimized: true → 원본을 그대로 제공)\n• loader 미호출 → currentSrc에 w 없음, 원본 ${APP_ORIGINAL_WIDTH}px\n• position:absolute, 박스 = 부모 박스`,
    actual:
      `• srcset: ${p.srcsetAttr ?? '없음'} / sizes: ${p.sizesAttr ?? '없음'}\n` +
      `• currentSrc w: ${noW ? '없음' : widthParam(p.currentSrc)} / 파일 폭 ${px(p.fileWidth)}\n` +
      `• position:${p.position}, 박스 ${p.boxWidth}×${p.boxHeight} / 부모 ${p.parentWidth}×${p.parentHeight}`,
    matched,
  }
}

export function judgeNativeFill(p: ImgProbe, preset: SizesPreset): CaseVerdict {
  const expectedSizes = preset.sizes ?? null
  const expectedWidths = ALL_WIDTHS.map((w) => `${w}w`).join(' ')
  const actualWidths = p.candidates.map((c) => `${c.value}${c.kind}`).join(' ')
  const choice = choiceLines(p)
  const matched =
    p.sizesAttr === expectedSizes &&
    actualWidths === expectedWidths &&
    choice.ok &&
    p.fileWidth === p.chosen?.value &&
    isFillBox(p)
  return {
    id: 'nativeFill',
    title: 'B. 네이티브 <img srcSet sizes> (브라우저 선택 원리)',
    expected:
      `• sizes 속성: ${expectedSizes === null ? '없음 → 브라우저가 100vw로 가정' : `"${expectedSizes}"`}\n` +
      `• w 후보 ${ALL_WIDTHS.length}개(문서 기본 imageSizes + deviceSizes): ${ALL_WIDTHS.join(' ')}\n` +
      `• 선택 후보 ≥ 필요값 바로 아래 후보, 파일 폭 = 선택 w\n• position:absolute, 박스 = 부모 박스 (A와 같은 레이아웃)`,
    actual:
      `• sizes: ${p.sizesAttr === null ? '없음' : `"${p.sizesAttr}"`} → 슬롯 ${p.slotWidth ?? '-'}px\n• 후보 ${p.candidates.length}개: ${actualWidths}\n${choice.text}\n` +
      `• 파일 폭 ${px(p.fileWidth)} / naturalWidth ${p.naturalWidth} (밀도 보정값)\n` +
      `• position:${p.position}, 박스 ${p.boxWidth}×${p.boxHeight} / 부모 ${p.parentWidth}×${p.parentHeight}`,
    matched,
  }
}

export function judgeFixedWidth(p: ImgProbe): CaseVerdict {
  const actualWidths = p.candidates.map((c) => `${widthParam(c.url)}@${c.value}${c.kind}`).join(' ')
  const choice = choiceLines(p)
  const chosenFile = p.chosen ? widthParam(p.chosen.url) : null
  const matched =
    p.sizesAttr === null &&
    actualWidths === FIXED_EXPECTED &&
    choice.ok &&
    p.fileWidth === chosenFile
  return {
    id: 'fixedWidth',
    title: `C. 네이티브 <img srcSet="… 1x, … 2x"> (고정 ${FIXED_WIDTH}px)`,
    expected: `• sizes 속성 없음\n• x 후보 2개: ${FIXED_EXPECTED} (뷰포트 무관, DPR만으로 선택)\n• 파일 폭 = 선택 후보의 w`,
    actual: `• sizes: ${p.sizesAttr ?? '없음'}\n• 후보: ${actualWidths}\n${choice.text}\n• 파일 폭 ${px(p.fileWidth)}`,
    matched,
  }
}
