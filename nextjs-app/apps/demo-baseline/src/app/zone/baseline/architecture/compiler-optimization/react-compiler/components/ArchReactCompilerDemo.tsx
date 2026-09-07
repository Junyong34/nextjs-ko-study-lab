'use client'

import {
  DemoDeepDiveCard,
  DemoPlaygroundCard,
  DemoResetButton,
  ExpectedActualPanel,
} from '@study/demo-kit'
import { useState } from 'react'
import { MemoizedProductGrid } from './MemoizedProductGrid'

const PRODUCTS = [
  { id: 'shoe', name: '러닝화', price: 129_000 },
  { id: 'jacket', name: '윈드브레이커', price: 189_000 },
  { id: 'cap', name: '러닝 캡', price: 39_000 },
]

interface ArchReactCompilerDemoProps {
  compilerMode: 'annotation'
  usesNativeCompiler: boolean
}

export function ArchReactCompilerDemo({ compilerMode, usesNativeCompiler }: ArchReactCompilerDemoProps) {
  'use memo'

  const [quantity, setQuantity] = useState(1)
  const [filter, setFilter] = useState('')
  const [unrelatedTick, setUnrelatedTick] = useState(0)
  const visibleProducts = PRODUCTS.filter((product) =>
    product.name.toLocaleLowerCase('ko').includes(filter.toLocaleLowerCase('ko')),
  )

  return (
    <>
      <DemoPlaygroundCard title="annotation 모드 opt-in 상품 목록">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <label className="space-y-1 text-xs font-semibold" htmlFor="compiler-filter">
              상품 필터
              <input id="compiler-filter" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="러닝화" className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 font-normal dark:border-zinc-700 dark:bg-zinc-900" />
            </label>
            <div className="flex items-end gap-2">
              <button type="button" onClick={() => setQuantity((current) => current + 1)} className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white">수량 증가</button>
              <button type="button" onClick={() => setUnrelatedTick((current) => current + 1)} className="rounded-md bg-zinc-700 px-3 py-2 text-xs font-semibold text-white">상품 목록과 무관한 상태 변경</button>
              <DemoResetButton onReset={() => { setQuantity(1); setFilter(''); setUnrelatedTick(0) }} />
            </div>
          </div>
          <p className="text-xs text-zinc-500">
            무관한 상태 변경 클릭 횟수: <span className="font-mono font-semibold">{unrelatedTick}</span> — 이 값은 아래 상품 목록의 props(products, quantity)에 전달되지 않습니다.
          </p>

          <MemoizedProductGrid products={visibleProducts} quantity={quantity} />
        </div>
      </DemoPlaygroundCard>

      <ExpectedActualPanel
        title="React Compiler 적용 계약"
        expected="reactCompiler: annotation구현체: Turbopack 네이티브 Rust컴포넌트: use memo로 opt-in"
        actual={`공유 설정: ${compilerMode}\n네이티브 구현체: ${usesNativeCompiler}\n현재 수량: ${quantity}\n필터 결과: ${visibleProducts.length}개`}
        isMatched={compilerMode === 'annotation' && usesNativeCompiler}
        description="설정값은 next.config.ts와 페이지가 같은 모듈에서 읽습니다. 실제 변환 가능 여부는 프로덕션 빌드로 검증합니다."
      />

      <DemoDeepDiveCard title="컴파일러 최적화와 런타임 관찰의 경계">
        <p>React Compiler는 빌드/변환 단계에서 컴포넌트와 훅을 분석해 순수한 계산과 JSX 생성을 자동으로 메모이즈합니다. &quot;리렌더링 0회&quot;를 항상 보장한다고 말할 수는 없지만, 이 변환의 효과 자체는 런타임에서 관찰할 수 있습니다 — 이 데모는 그 관찰을 콘솔 로그로 제공합니다.</p>
        <p>이 컴포넌트(&apos;use memo&apos;)가 <code>&lt;MemoizedProductGrid products={'{'}...{'}'} /&gt;</code>를 생성하는 코드를 컴파일러가 메모이즈했다면, products와 quantity가 바뀌지 않는 한 매번 같은 JSX 참조를 반환합니다. React는 참조가 같으면 그 하위 트리를 재조정하지 않으므로 [상품 목록과 무관한 상태 변경]을 눌러도 <code>MemoizedProductGrid</code>는 다시 렌더링되지 않고, 콘솔의 렌더 횟수 로그도 늘지 않습니다.</p>
        <p>Next.js 16.3의 <code>turbopackRustReactCompiler</code>는 Babel 변환 대신 Turbopack 내부의 네이티브 Rust 구현을 사용합니다. <code>compilationMode: &apos;annotation&apos;</code>과 함께 이 컴포넌트만 점진적으로 opt-in합니다.</p>
        <p>렌더 횟수 카운터는 렌더 본문이 아니라 <code>useEffect</code> 안에서만 증가시킵니다. 렌더 중에 외부 값을 변경하면 순수성이 깨져 컴파일러가 그 컴포넌트의 최적화를 포기할 수 있으므로, 관찰용 부수효과는 항상 렌더가 끝난 뒤에만 실행되도록 분리했습니다.</p>
      </DemoDeepDiveCard>
    </>
  )
}
