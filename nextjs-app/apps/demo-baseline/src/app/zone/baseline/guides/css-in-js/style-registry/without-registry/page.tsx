import { PlainProvider } from '../components/PlainProvider'
import { ProductShelf } from '../components/ProductShelf'

/** 대조군 라우트 — 같은 컴포넌트 트리지만 첫 HTML에는 클래스명만 있고 규칙이 없다. */
export default function WithoutRegistryPage() {
  return (
    <PlainProvider>
      <ProductShelf />
    </PlainProvider>
  )
}
