/**
 * 실제 CSS-in-JS 라이브러리(styled-components 등)의 서버 스타일시트를 최소 재현한 레지스트리.
 * 렌더링 도중 발견되는 CSS 규칙을 id 기준으로 모았다가, flush() 호출 시점까지 쌓인 규칙만
 * 반환하고 비운다 — useServerInsertedHTML이 매 스트리밍 플러시마다 호출하는 대상이다.
 */
export class StyleRuleRegistry {
  private rules = new Map<string, string>()

  add(id: string, css: string): void {
    this.rules.set(id, css)
  }

  flush(): string {
    if (this.rules.size === 0) return ''
    const css = [...this.rules.values()].join('\n')
    this.rules.clear()
    return css
  }
}
