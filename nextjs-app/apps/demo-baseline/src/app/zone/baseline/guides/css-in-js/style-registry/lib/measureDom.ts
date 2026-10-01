import type { DomProbeResult, StyleTagInfo } from '../types'
import type { StyleRegistry } from './registry'

const RULE_RE = /\.(sr-[a-z0-9]+)\s*\{/g

/** 하이드레이션이 끝난 DOM에서 style registry가 만든 <style>과 계산된 스타일을 직접 읽는다. */
export function measureDom(registry: StyleRegistry, probeEl: Element | null, dynamicAdds: number): DomProbeResult {
  const selectors: string[] = []
  const tags: StyleTagInfo[] = Array.from(document.querySelectorAll('style[data-registry]')).map((el) => {
    const css = el.textContent ?? ''
    const found = [...css.matchAll(RULE_RE)].map((m) => m[1])
    selectors.push(...found)
    return {
      source: el.getAttribute('data-registry') ?? '',
      parent: el.parentElement?.tagName ?? '',
      bytes: css.length,
      ruleCount: found.length,
    }
  })

  return {
    tags,
    duplicateSelectors: [...new Set(selectors.filter((name, i) => selectors.indexOf(name) !== i))],
    computedBackground: probeEl ? getComputedStyle(probeEl).backgroundColor : '',
    registered: registry.registered,
    adopted: registry.adopted,
    injected: registry.injected,
    dynamicAdds,
    measuredAt: new Date().toLocaleTimeString('ko-KR'),
  }
}
