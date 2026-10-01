import type { HtmlAnalysis, RegistryVariant } from '../types'

const STYLE_TAG_RE = /<style[^>]*data-registry="[^"]*"[^>]*>([\s\S]*?)<\/style>/g
const RULE_CLASS_RE = /\.(sr-[a-z0-9]+)\s*\{/g
const CLASS_ATTR_RE = /class="([^"]*)"/g

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

function snippetAround(html: string, index: number, before: number, after: number): string {
  const start = Math.max(0, index - before)
  const end = Math.min(html.length, index + after)
  return `${start > 0 ? '…' : ''}${html.slice(start, end).trim()}${end < html.length ? '…' : ''}`
}

/** 서버가 실제로 보낸 원본 HTML 문자열에서 style registry의 흔적을 읽는다. */
export function analyzeHtml(variant: RegistryVariant, status: number, html: string): HtmlAnalysis {
  const headEnd = html.indexOf('</head>')
  const tags = [...html.matchAll(STYLE_TAG_RE)]

  const ruleSelectors = tags.flatMap((tag) => [...tag[1].matchAll(RULE_CLASS_RE)].map((m) => m[1]))
  const ruleClasses = unique(ruleSelectors)
  const duplicateRules = ruleClasses.filter((name) => ruleSelectors.filter((s) => s === name).length > 1)

  // RSC 페이로드(<script>)와 <style> 본문은 제외하고, 실제로 렌더된 요소의 class만 센다
  const markup = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(STYLE_TAG_RE, '')
  const uses = [...markup.matchAll(CLASS_ATTR_RE)].flatMap((m) =>
    m[1].split(/\s+/).filter((name) => name.startsWith('sr-')),
  )
  const usedClasses = unique(uses)

  const firstStyleIndex = tags[0]?.index ?? -1
  const firstUseMatch = /class="[^"]*\bsr-[a-z0-9]+/.exec(html.replace(STYLE_TAG_RE, (m) => ' '.repeat(m.length)))
  const firstUseIndex = firstUseMatch?.index ?? -1

  return {
    variant,
    status,
    styleTagCount: tags.length,
    headTagCount: tags.filter((tag) => headEnd !== -1 && (tag.index ?? -1) < headEnd).length,
    usedClasses,
    ruleClasses,
    unstyledClasses: usedClasses.filter((name) => !ruleClasses.includes(name)),
    duplicateRules,
    styleBeforeFirstUse: firstStyleIndex !== -1 && firstUseIndex !== -1 && firstStyleIndex < firstUseIndex,
    usageCount: uses.length,
    snippet:
      firstUseIndex === -1
        ? '(sr-* 클래스를 쓰는 요소를 찾지 못했습니다)'
        : snippetAround(html, firstStyleIndex === -1 ? firstUseIndex : firstStyleIndex, 20, 260),
  }
}
