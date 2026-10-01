import { RegistryProvider } from '../components/RegistryProvider'
import { ProductShelf } from '../components/ProductShelf'

/** registry 사용 라우트 — 원본 HTML의 <head>에 <style data-registry="ssr">이 실린다. */
export default function WithRegistryPage() {
  return (
    <RegistryProvider>
      <ProductShelf />
    </RegistryProvider>
  )
}
