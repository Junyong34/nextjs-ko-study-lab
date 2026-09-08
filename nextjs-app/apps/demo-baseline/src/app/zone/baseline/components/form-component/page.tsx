import { Suspense } from 'react'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'
import { FormSearchClient } from './components/FormSearchClient'
import { VerificationFooter } from './components/VerificationFooter'
export const metadata = getDemoMetadata('baseline', 'components/form-component')
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams
  const query = (Array.isArray(params.q) ? params.q[0] : params.q ?? '').trim()
  const needle = query.toLowerCase()
  const products = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(needle) || p.tags.some(t => t.toLowerCase().includes(needle)))
  return <DemoContainer className="space-y-4">
    <DemoGuideCard title="Form으로 상품 검색하기" concept="next/form이 검색어를 URL로 전달하고 서버 페이지가 그 값으로 예시 상품을 검색합니다." steps={[
      { step: 1, title: '메모와 검색어 입력', description: '메모를 적고 상품명 또는 태그에 키보드를 입력합니다.' },
      { step: 2, title: '검색 후 URL과 결과 확인', description: '검색을 누르고 서버 검색어와 상품 목록을 확인합니다.', observe: '실습 내부 URL, 서버 검색어, 결과 수', observeAt: 'verification' },
      { step: 3, title: '빈 검색과 결과 없는 검색', description: '검색어를 지워 전체 상품을 보고, 없는상품으로 검색해 0건을 확인합니다. 메모는 유지됩니다.' },
      { step: 4, title: '실습 화면 새로고침', description: '검색어는 URL에 남지만 메모는 초기화됩니다. 예제 초기화는 검색어도 지웁니다.' },
    ]} />
    <DemoPlaygroundCard title="예시 상품 검색">
      <FormSearchClient query={query} />
      <p className="my-3 text-sm" role="status">제출한 검색어: {query || '(전체)'} / 검색 결과 {products.length}건</p>
      <div data-testid="search-results" className="grid gap-3 sm:grid-cols-2">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      {!products.length && <p>일치하는 상품이 없습니다. 검색어를 바꿔보세요.</p>}
    </DemoPlaygroundCard>
    <Suspense fallback={<p>검색 결과 확인 중…</p>}><VerificationFooter query={query} count={products.length} submitted={params.q !== undefined} /></Suspense>
  </DemoContainer>
}
