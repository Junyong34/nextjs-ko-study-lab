import { HookEnabledProvider } from '../registry/HookEnabledProvider'
import { ProductThemeShowcase } from '../components/ProductThemeShowcase'

/**
 * 실제 useServerInsertedHTML 훅이 동작하는 라우트.
 * curl로 이 라우트를 직접 호출하면 </head> 앞에 <style data-demo-registry="active">가
 * 실제로 삽입돼 있는 것을 확인할 수 있다.
 */
export default function WithHookPage() {
  return (
    <HookEnabledProvider>
      <ProductThemeShowcase variant="with-hook" />
    </HookEnabledProvider>
  )
}
