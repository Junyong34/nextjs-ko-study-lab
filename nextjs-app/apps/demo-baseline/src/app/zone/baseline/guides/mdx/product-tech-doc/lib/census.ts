import { COUNTED_TAGS, type DomCensus, type TagCounts } from '../types'

/** MDX가 렌더된 영역 안의 실제 요소를 센다. 서버에서 만든 HTML이 브라우저 DOM에 어떤 태그로 들어왔는지가 기준이다. */
export function takeCensus(root: HTMLElement): DomCensus {
  const counts = Object.fromEntries(COUNTED_TAGS.map((tag) => [tag, root.querySelectorAll(tag).length])) as TagCounts
  const pipeParagraphs = Array.from(root.querySelectorAll('p')).filter((p) => p.textContent?.includes('| --- |')).length
  const jsxTables = root.querySelectorAll('table[data-source="jsx"]').length
  return { counts, pipeParagraphs, jsxTables, measuredAt: new Date().toLocaleTimeString('ko-KR') }
}
