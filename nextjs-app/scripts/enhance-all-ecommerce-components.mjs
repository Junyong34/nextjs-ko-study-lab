import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_DIR = path.resolve(__dirname, '..')
const BASELINE_ROOT = path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline')
const CACHE_ROOT = path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache')

console.log('[enhance] E-commerce interactive component enhancement started...')

// Helper to write component
function writeComponent(filePath, code) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, code, 'utf8')
}

// 1. Directives
writeComponent(
  path.join(BASELINE_ROOT, 'directives/use-client/boundary-declaration/components/DirectiveUseClientDemo.tsx'),
  `'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard, type Product } from '@study/demo-kit'

export function DirectiveUseClientDemo() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [lastAction, setLastAction] = useState<string>('대기 중')

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev =>
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    )
    setLastAction(\`위시리스트 \${wishlist.includes(product.id) ? '해제' : '추가'}: \${product.name}\`)
  }

  const handleAddToCart = (product: Product) => {
    setCartCount(c => c + 1)
    setLastAction(\`장바구니 담기 완료 (+1): \${product.name}\`)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">🛒 장바구니: <span className="text-blue-600 font-extrabold">{cartCount}</span>개</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">❤️ 찜한 상품: <span className="text-rose-600 font-extrabold">{wishlist.length}</span>개</span>
        </div>
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          최근 액션: {lastAction}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MOCK_PRODUCTS.slice(0, 2).map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            isWishlisted={wishlist.includes(p.id)}
          />
        ))}
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'directives/use-client/window-storage-access/components/StorageClientDemo.tsx'),
  `'use client'
import React, { useState, useEffect } from 'react'
import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export function StorageClientDemo() {
  const [recentViewed, setRecentViewed] = useState<Product[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('demo_recent_products')
      if (saved) {
        setRecentViewed(JSON.parse(saved))
      }
    } catch {
      // ignore SSR
    }
  }, [])

  const addRecent = (product: Product) => {
    const next = [product, ...recentViewed.filter(p => p.id !== product.id)].slice(0, 4)
    setRecentViewed(next)
    try {
      localStorage.setItem('demo_recent_products', JSON.stringify(next))
    } catch {}
  }

  const clearStorage = () => {
    setRecentViewed([])
    try {
      localStorage.removeItem('demo_recent_products')
    } catch {}
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">👁️ 최근 본 상품 (브라우저 localStorage 동기화)</h4>
        <button
          type="button"
          onClick={clearStorage}
          className="rounded border border-zinc-200 px-2 py-1 text-[11px] text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer"
        >
          기록 비우기
        </button>
      </div>

      <div className="space-y-1.5">
        <span className="text-zinc-500 font-medium">상품 클릭하여 최근 본 목록에 추가:</span>
        <div className="flex flex-wrap gap-2">
          {MOCK_PRODUCTS.slice(0, 4).map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => addRecent(p)}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-blue-500 transition cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800">
        <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
          저장된 최근 본 상품 목록 ({recentViewed.length}개):
        </div>
        {recentViewed.length === 0 ? (
          <div className="text-zinc-400">최근 본 상품이 없습니다. 위 상품을 클릭해보세요.</div>
        ) : (
          <div className="space-y-1">
            {recentViewed.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                <span>{idx + 1}. {item.name} ({item.categoryName})</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.price.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'directives/use-server/file-level-action/components/DirectiveUseServerDemo.tsx'),
  `'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_COUPONS, type Coupon } from '@study/demo-kit'

export function DirectiveUseServerDemo() {
  const [couponCode, setCouponCode] = useState('WELCOME2026')
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [status, setStatus] = useState<string>('대기 중')
  const [isPending, startTransition] = useTransition()

  const orderAmount = 189000

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      // Simulate server action
      await new Promise(r => setTimeout(r, 600))
      const found = MOCK_COUPONS.find(c => c.code === couponCode.toUpperCase().trim())
      if (found) {
        if (orderAmount < found.minOrderAmount) {
          setStatus(\`쿠폰 적용 불가: 최소 주문금액 \${found.minOrderAmount.toLocaleString()}원 이상이어야 합니다.\`)
          setAppliedCoupon(null)
        } else {
          setAppliedCoupon(found)
          setStatus(\`쿠폰 적용 성공! (\${found.name})\`)
        }
      } else {
        setStatus('유효하지 않은 쿠폰 코드입니다.')
        setAppliedCoupon(null)
      }
    })
  }

  const discountVal = appliedCoupon
    ? appliedCoupon.discountType === 'PERCENT'
      ? (orderAmount * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
    : 0

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🎟️ 장바구니 할인 쿠폰 적용 (File-Level Server Action)</h4>
        <p className="text-zinc-500 text-[11px] mt-0.5">별도 모듈에 선언된 파일 레벨 'use server' 함수를 클라이언트 폼에서 직접 호출합니다.</p>
      </div>

      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={e => setCouponCode(e.target.value)}
          placeholder="쿠폰 코드 입력 (예: WELCOME2026, VIPSPECIAL)"
          className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 font-mono dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-blue-600 px-4 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '검증 중...' : '쿠폰 적용'}
        </button>
      </form>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900/50 space-y-2 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex justify-between">
          <span className="text-zinc-500">주문 상품 금액:</span>
          <span className="font-mono font-bold">{orderAmount.toLocaleString()}원</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-rose-600 dark:text-rose-400">
            <span>쿠폰 할인 ({appliedCoupon.name}):</span>
            <span className="font-mono font-bold">-{discountVal.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between border-t border-dashed pt-2 font-bold text-zinc-900 dark:text-zinc-100">
          <span>최종 결제 예정 금액:</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">
            {(orderAmount - discountVal).toLocaleString()}원
          </span>
        </div>
        <div className="text-[11px] text-zinc-500 pt-1 font-mono">
          상태: {status}
        </div>
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'directives/use-server/inline-action-closure/components/InlineActionClosureDemo.tsx'),
  `'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function InlineActionClosureDemo() {
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0])
  const [orderResult, setOrderResult] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleInstantBuy = () => {
    startTransition(async () => {
      // Simulate inline server closure action
      await new Promise(r => setTimeout(r, 700))
      const orderNo = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
      setOrderResult(\`✅ [즉시 주문 성공] 주문번호: \${orderNo} | 상품: \${selectedProduct.name} | 결제금액: \${selectedProduct.price.toLocaleString()}원\`)
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">⚡ 상품 즉시 결제 (컴포넌트 인라인 'use server' 클로저)</h4>
        <p className="text-zinc-500 text-[11px] mt-0.5">컴포넌트 스코프의 변수(productId, price)를 클로저로 캡처하여 즉시 구매를 실행합니다.</p>
      </div>

      <div className="flex gap-2">
        {MOCK_PRODUCTS.slice(0, 3).map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelectedProduct(p)}
            className={\`flex-1 rounded border p-2 text-left cursor-pointer transition \${
              selectedProduct.id === p.id
                ? 'border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }\`}
          >
            <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</div>
            <div className="text-blue-600 dark:text-blue-400 font-extrabold font-mono mt-1">{p.price.toLocaleString()}원</div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">선택 상품: {selectedProduct.name}</div>
          <div className="text-zinc-500 text-[11px]">단독 구매 배송비: 무료배송</div>
        </div>
        <button
          type="button"
          onClick={handleInstantBuy}
          disabled={isPending}
          className="rounded bg-rose-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition"
        >
          {isPending ? '결제 처리 중...' : '원클릭 즉시 구매'}
        </button>
      </div>

      {orderResult && (
        <div className="rounded border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-mono">
          {orderResult}
        </div>
      )}
    </div>
  )
}
`
)

console.log('[enhance] Directives e-commerce components updated')

// 2. Functions
writeComponent(
  path.join(BASELINE_ROOT, 'functions/use-router/push-replace/components/NavigationClientDemo.tsx'),
  `'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function NavigationClientDemo() {
  const [currentVirtualUrl, setCurrentVirtualUrl] = useState('/shop/products')
  const [historyStack, setHistoryStack] = useState<string[]>(['/shop/products'])
  const [cartItemsCount, setCartItemsCount] = useState(2)

  const handlePush = (target: string) => {
    setCurrentVirtualUrl(target)
    setHistoryStack(prev => [...prev, target])
  }

  const handleReplace = (target: string) => {
    setCurrentVirtualUrl(target)
    setHistoryStack(prev => [...prev.slice(0, -1), target])
  }

  const handleBack = () => {
    if (historyStack.length > 1) {
      const next = historyStack.slice(0, -1)
      setHistoryStack(next)
      setCurrentVirtualUrl(next[next.length - 1])
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🧭 useRouter 프로그래밍 네비게이션 시뮬레이터</h4>
          <p className="text-zinc-500 text-[11px]">router.push vs router.replace vs router.back의 쇼핑몰 화면 전환 동작을 대조합니다.</p>
        </div>
        <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300">
          현재 경로: {currentVirtualUrl}
        </div>
      </div>

      {/* 시나리오 버튼들 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handlePush('/shop/products/prod-001')}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
        >
          <div className="font-bold text-blue-600">1. router.push(상세)</div>
          <div className="text-zinc-500 text-[11px]">히스토리 추가하며 상품 상세로 이동</div>
        </button>

        <button
          type="button"
          onClick={() => handleReplace('/shop/checkout/success')}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-emerald-500 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-pointer"
        >
          <div className="font-bold text-emerald-600">2. router.replace(결제완료)</div>
          <div className="text-zinc-500 text-[11px]">뒤로가기 방지하며 완료 페이지 대체</div>
        </button>

        <button
          type="button"
          onClick={handleBack}
          disabled={historyStack.length <= 1}
          className="rounded border border-zinc-200 bg-zinc-50 p-2 text-left hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 disabled:opacity-40 cursor-pointer"
        >
          <div className="font-bold text-zinc-800 dark:text-zinc-200">3. router.back()</div>
          <div className="text-zinc-500 text-[11px]">이전 탐색 화면으로 되돌아가기</div>
        </button>
      </div>

      {/* 브라우저 히스토리 스택 뷰 */}
      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">브라우저 히스토리 스택 ({historyStack.length}단계):</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {historyStack.map((url, idx) => (
            <span
              key={idx}
              className={\`rounded px-2 py-0.5 text-[11px] \${
                idx === historyStack.length - 1
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }\`}
            >
              {idx + 1}. {url}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'functions/use-router/refresh-server-sync/components/RouterRefreshDemo.tsx'),
  `'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function RouterRefreshDemo() {
  const [stock, setStock] = useState(MOCK_PRODUCTS[0].stock)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date().toLocaleTimeString('ko-KR'))
  const [isPending, startTransition] = useTransition()

  const handleSimulateStockChange = () => {
    // Other client buys product
    setStock(s => Math.max(0, s - 3))
  }

  const handleRouterRefresh = () => {
    startTransition(async () => {
      await new Promise(r => setTimeout(r, 500))
      setLastRefreshedAt(new Date().toLocaleTimeString('ko-KR'))
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🔄 router.refresh() 서버 재고 실시간 재검증 동기화</h4>
          <p className="text-zinc-500 text-[11px]">클라이언트 상태(입력값/스크롤)를 유지하면서 서버 컴포넌트 데이터만 강제 재실행합니다.</p>
        </div>
        <span className="font-mono text-zinc-500">최종 동기화: {lastRefreshedAt}</span>
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <span className="text-zinc-500">상품명:</span>
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{MOCK_PRODUCTS[0].name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-zinc-500">실시간 잔여 재고:</span>
            <span className={\`font-mono font-extrabold text-sm \${stock <= 5 ? 'text-rose-600' : 'text-emerald-600'}\`}>
              {stock}개
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSimulateStockChange}
            className="rounded border border-amber-300 bg-amber-50 px-3 py-1.5 font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300 cursor-pointer"
          >
            타 고객 구매 발생 (-3개)
          </button>
          <button
            type="button"
            onClick={handleRouterRefresh}
            disabled={isPending}
            className="rounded bg-blue-600 px-3.5 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? '서버 동기화 중...' : 'router.refresh() 호출'}
          </button>
        </div>
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'functions/use-search-params/filter-parsing/components/FilterParsingDemo.tsx'),
  `'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard, type Product } from '@study/demo-kit'

export function FilterParsingDemo() {
  const [category, setCategory] = useState<string>('all')
  const [sort, setSort] = useState<string>('best')
  const [maxPrice, setMaxPrice] = useState<number>(350000)

  const filtered = MOCK_PRODUCTS.filter(p => {
    if (category !== 'all' && p.category !== category) return false
    if (p.price > maxPrice) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating') return b.rating - a.rating
    return (b.isBest ? 1 : 0) - (a.isBest ? 1 : 0)
  })

  const currentQueryString = \`?category=\${category}&sort=\${sort}&maxPrice=\${maxPrice}\`

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🔍 useSearchParams() 상품 필터 & 정렬 쿼리 파싱</h4>
          <p className="text-zinc-500 text-[11px]">URL SearchParams 쿼리를 파싱하여 실시간 상품 목록을 필터링 및 정렬합니다.</p>
        </div>
        <div className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded dark:bg-blue-950 dark:text-blue-300 font-bold">
          {currentQueryString}
        </div>
      </div>

      {/* 필터 툴바 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded bg-zinc-50 p-3 dark:bg-zinc-900">
        <div>
          <label className="block text-zinc-500 font-medium mb-1">카테고리</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            <option value="all">전체 카테고리</option>
            <option value="electronics">전자기기</option>
            <option value="fashion">패션/의류</option>
            <option value="books">도서</option>
            <option value="living">리빙/인테리어</option>
            <option value="sports">스포츠/레저</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-500 font-medium mb-1">정렬 기준</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white p-1.5 dark:border-zinc-700 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
          >
            <option value="best">인기/추천순</option>
            <option value="price-asc">낮은 가격순</option>
            <option value="price-desc">높은 가격순</option>
            <option value="rating">평점 높은순</option>
          </select>
        </div>

        <div>
          <label className="block text-zinc-500 font-medium mb-1">
            최대 가격: <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{maxPrice.toLocaleString()}원</span>
          </label>
          <input
            type="range"
            min="30000"
            max="350000"
            step="10000"
            value={maxPrice}
            onChange={e => setMaxPrice(Number(e.target.value))}
            className="w-full cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {/* 결과 상품 목록 */}
      <div className="space-y-2">
        <div className="font-bold text-zinc-700 dark:text-zinc-300">
          조회 결과 ({filtered.length}개 상품):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'functions/cookies/get-set-session/components/CookiesSessionDemo.tsx'),
  `'use client'
import React, { useState } from 'react'
import { MOCK_USER_SESSIONS } from '@study/demo-kit'

export function CookiesSessionDemo() {
  const [currentRole, setCurrentRole] = useState<'customer' | 'vip' | 'admin'>('customer')
  const [cartSessionId, setCartSessionId] = useState('guest_cart_' + Math.floor(1000 + Math.random() * 9000))
  const [issuedCookies, setIssuedCookies] = useState<Record<string, string>>({
    'session-token': 'jwt_token_sample_abc123',
    'cart-session': cartSessionId,
    'user-role': 'CUSTOMER'
  })

  const handleSwitchUser = (role: 'customer' | 'vip' | 'admin') => {
    setCurrentRole(role)
    const session = MOCK_USER_SESSIONS[role]
    setIssuedCookies({
      'session-token': 'jwt_' + session.userId + '_' + Date.now(),
      'cart-session': 'cart_' + session.userId,
      'user-role': session.role,
      'user-tier': session.tier
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🍪 cookies().get() & set() 세션 및 장바구니 쿠키 관리</h4>
          <p className="text-zinc-500 text-[11px]">서버 컴포넌트/Server Actions에서 HttpOnly 세션 쿠키를 안전하게 발급 및 검증합니다.</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['customer', 'vip', 'admin'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => handleSwitchUser(r)}
            className={\`flex-1 rounded p-2 text-left cursor-pointer transition \${
              currentRole === r
                ? 'border-blue-600 bg-blue-50/50 border font-bold dark:border-blue-500 dark:bg-blue-950/20'
                : 'border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }\`}
          >
            <div className="text-zinc-900 dark:text-zinc-100">{MOCK_USER_SESSIONS[r].name} ({MOCK_USER_SESSIONS[r].role})</div>
            <div className="text-zinc-500 text-[11px] font-mono mt-0.5">등급: {MOCK_USER_SESSIONS[r].tier} | 적립금: {MOCK_USER_SESSIONS[r].points.toLocaleString()}P</div>
          </button>
        ))}
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono space-y-1.5">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">현재 요청의 Server Cookies 헤더:</span>
        {Object.entries(issuedCookies).map(([k, v]) => (
          <div key={k} className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{k}</span>
            <span className="text-zinc-900 dark:text-zinc-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'functions/after/background-logging/components/AfterLoggingDemo.tsx'),
  `'use client'
import React, { useState, useTransition } from 'react'
import { MOCK_ORDERS } from '@study/demo-kit'

export function AfterLoggingDemo() {
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: 'client' | 'after' }>>([])
  const [isPending, startTransition] = useTransition()

  const handleCompleteOrder = () => {
    const now = new Date().toLocaleTimeString('ko-KR')
    setLogs(prev => [
      { time: now, msg: '⚡ [주문 응답 반환] 브라우저에 주문 완료 페이지 즉시 렌더링 (응답 지연 0ms)', type: 'client' }
    ])

    startTransition(async () => {
      // simulate after() background work
      await new Promise(r => setTimeout(r, 800))
      const afterTime = new Date().toLocaleTimeString('ko-KR')
      setLogs(prev => [
        ...prev,
        { time: afterTime, msg: '📦 [after() 작업 1] 물류 센터 WMS 시스템에 출고 지시 데이터 전송 완료', type: 'after' },
        { time: afterTime, msg: '📱 [after() 작업 2] 카카오 알림톡 주문 접수 안내 메시지 비동기 발송 완료', type: 'after' },
        { time: afterTime, msg: '📊 [after() 작업 3] 데이터웨어하우스(DW)에 구매 전환 이벤트 로그 적재 완료', type: 'after' }
      ])
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🚀 after() 백그라운드 주문 후속 처리 (Response 지연 0ms)</h4>
          <p className="text-zinc-500 text-[11px]">응답을 브라우저에 즉시 보낸 후, 재고 차감/알림톡/DW 로그 작업을 백그라운드에서 실행합니다.</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded bg-zinc-50 p-3.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="font-bold text-zinc-900 dark:text-zinc-100">주문 결제 금액: 259,200원 (2건)</div>
          <div className="text-zinc-500 text-[11px]">주문번호: {MOCK_ORDERS[0].orderNumber}</div>
        </div>
        <button
          type="button"
          onClick={handleCompleteOrder}
          disabled={isPending}
          className="rounded bg-emerald-600 px-4 py-2 font-bold text-white shadow-2xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? '백그라운드 처리 중...' : '최종 결제 승인 요청'}
        </button>
      </div>

      <div className="space-y-2">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">서버 실행 로그 타임라인:</span>
        <div className="space-y-1.5 font-mono">
          {logs.length === 0 ? (
            <div className="text-zinc-400 p-2">결제 승인 버튼을 누르면 after() 동작 로그가 기록됩니다.</div>
          ) : (
            logs.map((l, i) => (
              <div
                key={i}
                className={\`p-2 rounded \${
                  l.type === 'client'
                    ? 'bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-bold'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                }\`}
              >
                <span className="text-zinc-400 mr-2">[{l.time}]</span>
                {l.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
`
)

// 3. Components
writeComponent(
  path.join(BASELINE_ROOT, 'components/form-component/components/FormSearchClient.tsx'),
  `'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'

export function FormSearchClient() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittedQuery(query)
  }

  const results = MOCK_PRODUCTS.filter(p =>
    !submittedQuery ? true : p.name.toLowerCase().includes(submittedQuery.toLowerCase()) || p.tags.some(t => t.includes(submittedQuery))
  )

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">📋 Next.js 빌트인 &lt;Form&gt; 컴포넌트 & GET 검색 동기화</h4>
        <p className="text-zinc-500 text-[11px]">GET 방식 폼 제출 시 URL searchParams와 동기화되며 Prefetch 및 클라이언트 네비게이션이 자동 최적화됩니다.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="상품명, 태그 검색 (예: 키보드, 무선, 데님)"
          className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          검색
        </button>
      </form>

      <div className="space-y-2">
        <div className="flex justify-between text-zinc-500 font-mono">
          <span>검색어: "{submittedQuery || '전체'}"</span>
          <span>검색된 상품: {results.length}건</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {results.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
`
)

writeComponent(
  path.join(BASELINE_ROOT, 'components/script/loading-strategies/components/ScriptLoadingStrategiesDemo.tsx'),
  `'use client'
import React, { useState } from 'react'

export function ScriptLoadingStrategiesDemo() {
  const [selectedStrategy, setSelectedStrategy] = useState<'beforeInteractive' | 'afterInteractive' | 'lazyOnload'>('afterInteractive')
  const [loadedScripts, setLoadedScripts] = useState<string[]>([])

  const strategies = [
    {
      key: 'beforeInteractive',
      name: 'beforeInteractive',
      target: '결제 보안 봇 감지 모듈 (Bot Detection)',
      desc: 'HTML 셸 수신 직후 페이지 인터랙션 전 최우선 로드'
    },
    {
      key: 'afterInteractive',
      name: 'afterInteractive (기본값)',
      target: '토스페이먼츠 / 카카오페이 결제창 SDK',
      desc: '페이지 하이드레이션 완료 후 즉시 로드'
    },
    {
      key: 'lazyOnload',
      name: 'lazyOnload',
      target: 'Google Analytics 전자상거래 구매 추적 픽셀',
      desc: '브라우저 유휴 시간(Idle)에 지연 로드하여 LCP/INP 보호'
    }
  ]

  const handleSimulateLoad = (key: any) => {
    setSelectedStrategy(key)
    if (!loadedScripts.includes(key)) {
      setLoadedScripts(prev => [...prev, key])
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">📜 next/script 로딩 전략별 결제 SDK 및 추적 스크립트 실행 순서</h4>
        <p className="text-zinc-500 text-[11px]">이커머스 결제창, 봇 감지, 애널리틱스 스크립트의 실행 우선순위를 최적화합니다.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {strategies.map(s => (
          <button
            key={s.key}
            type="button"
            onClick={() => handleSimulateLoad(s.key)}
            className={\`p-3 rounded border text-left cursor-pointer transition \${
              selectedStrategy === s.key
                ? 'border-blue-600 bg-blue-50/50 font-bold dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }\`}
          >
            <div className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">{s.name}</div>
            <div className="text-zinc-900 dark:text-zinc-100 font-bold mt-1">{s.target}</div>
            <div className="text-zinc-500 text-[10px] mt-1">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 font-mono space-y-1.5">
        <div className="font-bold text-zinc-700 dark:text-zinc-300">
          활성 전략: &lt;Script strategy="{selectedStrategy}" /&gt;
        </div>
        <div className="text-emerald-600 dark:text-emerald-400">
          ● {strategies.find(s => s.key === selectedStrategy)?.target} 로딩 준비 완료 (onLoad 이벤트 대기)
        </div>
      </div>
    </div>
  )
}
`
)

// 4. Mutating Data
writeComponent(
  path.join(BASELINE_ROOT, 'mutating-data/optimistic-cart/components/OptimisticCartDemo.tsx'),
  `'use client'
import React, { useState, useOptimistic, useTransition } from 'react'
import { MOCK_PRODUCTS, CartSummary, type CartItem } from '@study/demo-kit'

export function OptimisticCartDemo() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], quantity: 1, selected: true },
    { product: MOCK_PRODUCTS[1], quantity: 2, selected: true }
  ])
  const [isPending, startTransition] = useTransition()

  const [optimisticCart, setOptimisticCart] = useOptimistic(
    cartItems,
    (state, update: { productId: string; delta: number }) => {
      return state.map(item => {
        if (item.product.id === update.productId) {
          const newQty = Math.max(1, item.quantity + update.delta)
          return { ...item, quantity: newQty }
        }
        return item
      })
    }
  )

  const handleQuantityChange = (productId: string, delta: number) => {
    startTransition(async () => {
      // 1. 낙관적 즉각 반영
      setOptimisticCart({ productId, delta })
      // 2. 서버 동기화
      await new Promise(r => setTimeout(r, 600))
      setCartItems(prev =>
        prev.map(item => {
          if (item.product.id === productId) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) }
          }
          return item
        })
      )
    })
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId))
  }

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="flex items-center gap-2 rounded bg-amber-50 px-3 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
          <span className="animate-spin">⏳</span>
          Server Action 실행 중... 낙관적 UI에 의해 브라우저 수량은 0ms 즉시 갱신되었습니다.
        </div>
      )}

      <CartSummary
        items={optimisticCart}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => alert('주문서 페이지로 이동합니다.')}
      />
    </div>
  )
}
`
)

console.log('[enhance] All components enhanced successfully!')
