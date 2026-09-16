import { Suspense } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import { ThemeBadge } from './ThemeBadge'
import { DelayedMouseBadge } from './DelayedMouseBadge'
import type { ProbeVariant } from '../types'

const KEYBOARD = MOCK_PRODUCTS.find((p) => p.id === 'prod-001')!
const MOUSE = MOCK_PRODUCTS.find((p) => p.id === 'prod-002')!

/**
 * with-hook / without-hook 두 실제 라우트가 공유하는 화면.
 * Provider(HookEnabled/HookDisabled)만 다르고 이 안의 컴포넌트 트리는 완전히 동일하다 —
 * 그래야 두 라우트의 원본 HTML 차이가 오직 훅 사용 여부에서만 비롯됐다고 말할 수 있다.
 */
export function ProductThemeShowcase({ variant }: { variant: ProbeVariant }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 480 }}>
      <p style={{ fontSize: 12, color: '#71717a', marginBottom: 14 }}>
        useServerInsertedHTML {variant === 'with-hook' ? '적용' : '미적용'} 라우트입니다. curl 또는 개발자 도구
        Network 탭의 Response로 원본 SSR 응답을 확인하세요.
      </p>
      <section style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <strong>{KEYBOARD.name}</strong>
        <ThemeBadge productKey="keyboard" />
      </section>
      <section style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <strong>{MOUSE.name}</strong>
        <Suspense fallback={<span style={{ color: '#a1a1aa' }}>불러오는 중...</span>}>
          <DelayedMouseBadge />
        </Suspense>
      </section>
    </main>
  )
}
