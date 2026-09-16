import { HookDisabledProvider } from '../registry/HookDisabledProvider'
import { ProductThemeShowcase } from '../components/ProductThemeShowcase'

/**
 * useServerInsertedHTML을 호출하지 않는 대조군 라우트.
 * curl로 이 라우트를 직접 호출하면 <style data-demo-registry>가 원본 응답에
 * 전혀 없다는 것을 확인할 수 있다 — 스타일은 하이드레이션 이후에만 DOM에 붙는다.
 */
export default function WithoutHookPage() {
  return (
    <HookDisabledProvider>
      <ProductThemeShowcase variant="without-hook" />
    </HookDisabledProvider>
  )
}
