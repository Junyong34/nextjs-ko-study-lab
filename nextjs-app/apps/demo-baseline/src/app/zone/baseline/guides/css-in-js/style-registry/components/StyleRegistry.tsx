'use client'
import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'

// 아주 작은 실제 CSS-in-JS 러너: 규칙을 등록하고 클래스명을 반환한다.
class CssRegistry {
  rules = new Map<string, string>()
  insert(className: string, css: string) {
    this.rules.set(className, css)
  }
  getCssText() {
    return Array.from(this.rules.values()).join('\n')
  }
}

export function StyleRegistry({ children }: { children: React.ReactNode }) {
  const [registry] = useState(() => new CssRegistry())
  registry.insert('.demo-css-in-js-btn', '.demo-css-in-js-btn { background:#000; color:#fff; padding:6px 12px; border-radius:4px; font-weight:700; }')

  // 이 훅은 SSR 스트리밍 중 React가 이 시점까지 렌더링한 HTML 청크에
  // 실제로 <style> 태그를 주입한다 — next/navigation의 진짜 API다.
  useServerInsertedHTML(() => (
    <style data-demo-css-registry dangerouslySetInnerHTML={{ __html: registry.getCssText() }} />
  ))

  return <>{children}</>
}
