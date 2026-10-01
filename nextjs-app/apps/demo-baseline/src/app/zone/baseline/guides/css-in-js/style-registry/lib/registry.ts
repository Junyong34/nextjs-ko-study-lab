/**
 * styled-components·Emotion의 서버 스타일시트를 최소로 재현한 style registry.
 * 렌더 중 insert()로 규칙을 수집하고, 서버에서는 flush()가 쌓인 규칙을 한 번에 꺼내 주며,
 * 클라이언트에서는 commit()이 "이미 SSR로 도착한 규칙"은 재사용(adopt)하고 새 규칙만 주입한다.
 * 클래스명은 CSS 문자열의 해시라 서버와 클라이언트가 같은 값을 만든다 (하이드레이션 일치).
 */
export const CLIENT_STYLE_ATTR = 'client'
export const SSR_STYLE_ATTR = 'ssr'

function hash(text: string): string {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return h.toString(36)
}

export class StyleRegistry {
  private rules = new Map<string, string>()
  private unflushed: string[] = []
  private uncommitted: string[] = []
  private clientClasses: string[] = []
  adopted = 0
  injected = 0

  get registered(): number {
    return this.rules.size
  }

  /** css의 `&`를 생성된 클래스 selector로 바꿔 등록한다. 같은 css는 한 번만 등록(dedupe). */
  insert(css: string): string {
    const className = `sr-${hash(css)}`
    if (!this.rules.has(className)) {
      const rule = css.replaceAll('&', `.${className}`)
      this.rules.set(className, rule)
      this.unflushed.push(rule)
      this.uncommitted.push(className)
    }
    return className
  }

  /** 서버 전용: 마지막 flush 이후 쌓인 규칙만 반환하고 비운다. */
  flush(): string {
    const css = this.unflushed.join('\n')
    this.unflushed = []
    return css
  }

  /** 클라이언트 전용: SSR <style>에 이미 있는 규칙은 재사용하고, 없는 규칙만 <style data-registry="client">로 주입한다. */
  commit(doc: Document): void {
    if (this.uncommitted.length === 0) return
    const ssrCss = Array.from(doc.querySelectorAll(`style[data-registry="${SSR_STYLE_ATTR}"]`))
      .map((el) => el.textContent ?? '')
      .join('\n')
    for (const className of this.uncommitted.splice(0)) {
      const rule = this.rules.get(className) ?? ''
      if (ssrCss.includes(rule)) {
        this.adopted += 1
        continue
      }
      const el = doc.createElement('style')
      el.setAttribute('data-registry', CLIENT_STYLE_ATTR)
      el.textContent = rule
      doc.head.appendChild(el)
      this.clientClasses.push(className)
      this.injected += 1
    }
  }

  /** 클라이언트가 주입한 규칙과 <style>을 제거한다 (SSR이 보낸 규칙은 그대로 둔다). */
  resetClient(doc: Document): void {
    doc.querySelectorAll(`style[data-registry="${CLIENT_STYLE_ATTR}"]`).forEach((el) => el.remove())
    for (const className of this.clientClasses.splice(0)) this.rules.delete(className)
    this.injected = 0
  }
}
