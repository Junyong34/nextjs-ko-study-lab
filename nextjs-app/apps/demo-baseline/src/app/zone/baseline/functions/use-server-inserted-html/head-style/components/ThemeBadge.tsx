'use client'

import { useStyleRegistry } from '../registry/StyleRegistryContext'
import type { ProductThemeKey, ThemeDefinition } from '../types'

const THEME_BY_PRODUCT: Record<ProductThemeKey, ThemeDefinition> = {
  keyboard: {
    className: 'registry-badge-keyboard',
    css: '.registry-badge-keyboard{background:#2563eb;color:#fff;padding:2px 10px;border-radius:9999px;font-weight:700;font-size:11px}',
    label: 'BEST 강조 테마',
  },
  mouse: {
    className: 'registry-badge-mouse',
    css: '.registry-badge-mouse{background:#059669;color:#fff;padding:2px 10px;border-radius:9999px;font-weight:700;font-size:11px}',
    label: 'NEW 강조 테마',
  },
}

/**
 * 렌더링 도중 CSS 규칙을 레지스트리에 등록한다 — styled-components/Emotion 등
 * 실제 CSS-in-JS 라이브러리가 렌더 패스 중 스타일시트를 수집하는 것과 동일한 방식이다.
 * 이 컴포넌트 자신은 훅 사용 여부를 모른다: 어떤 Provider 아래 있느냐에 따라
 * 이 규칙이 SSR 스트림에 실리거나(HookEnabledProvider), 실리지 않는다(HookDisabledProvider).
 */
export function ThemeBadge({ productKey }: { productKey: ProductThemeKey }) {
  const registry = useStyleRegistry()
  const theme = THEME_BY_PRODUCT[productKey]
  registry.add(theme.className, theme.css)
  return <span className={theme.className}>{theme.label}</span>
}
