import type { ElementInfo } from '../types'
import { MAPPED_SELECTOR } from '../expectations'

/** 렌더된 MDX 영역에서 전역 매핑 대상 요소를 문서 순서대로 읽는다. */
export function inspectPane(root: HTMLElement): ElementInfo[] {
  return Array.from(root.querySelectorAll<HTMLElement>(MAPPED_SELECTOR), (el) => {
    const cs = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(),
      globalClass: el.classList.contains('mdx-g'),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
    }
  })
}

export const tagsOf = (items: ElementInfo[]) => items.map((i) => i.tag).join(',')
