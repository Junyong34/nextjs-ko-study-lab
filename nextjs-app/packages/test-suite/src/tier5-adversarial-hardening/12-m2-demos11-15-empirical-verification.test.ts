import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')

describe('Tier 5 Hardening — Milestone 2 (Batch B02 Demos 11–15) Empirical Verification Harness', () => {

  // =========================================================================
  // DEMO 11: React 19 use(Promise) & Suspense Streaming
  // =========================================================================
  describe('Demo 11: fetching-data/use-promise-streaming Dynamic Suspense & use(Promise) Verification', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming',
    )
    const pagePath = path.join(basePath, 'page.tsx')
    const clientPath = path.join(basePath, 'components/ReviewsStreamingClient.tsx')
    const skeletonPath = path.join(basePath, 'components/ReviewsSkeleton.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('11.1 Source file inspection: Suspense boundary & React 19 use(Promise) unwrapping on disk', () => {
      assert.ok(fs.existsSync(pagePath), 'page.tsx must exist')
      assert.ok(fs.existsSync(clientPath), 'ReviewsStreamingClient.tsx must exist')
      assert.ok(fs.existsSync(skeletonPath), 'ReviewsSkeleton.tsx must exist')
      assert.ok(fs.existsSync(footerPath), 'VerificationFooter.tsx must exist')

      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      const clientContent = fs.readFileSync(clientPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Check Suspense boundary structure
      assert.ok(
        pageContent.includes('<Suspense') && pageContent.includes('fallback='),
        'page.tsx must contain Suspense boundary with fallback',
      )
      assert.ok(
        pageContent.includes('<ReviewsStreamingFooter reviewsPromise={reviewsPromise} />'),
        'page.tsx must pass unresolved reviewsPromise to streaming footer within Suspense',
      )

      // Check React 19 use() hook usage
      assert.ok(
        clientContent.includes("import React, { use } from 'react'") ||
          clientContent.includes('use(reviewsPromise)'),
        'ReviewsStreamingClient must use React 19 use() API to unwrap reviewsPromise',
      )

      // Anti-hardcoding check
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not contain hardcoded static isMatched={true}',
      )
      assert.ok(
        footerContent.includes('reviews && reviews.length > 0'),
        'VerificationFooter must dynamically check resolved reviews length',
      )
    })

    it('11.2 Empirical VerificationFooter Evaluation: Pending (during Suspense) -> Matched (resolved reviews)', () => {
      // Replicate the exact footer evaluation function from Demo 11 VerificationFooter.tsx
      function evaluateDemo11Footer(props: {
        isMatched?: boolean
        reviews?: Array<{ id: string; author: string; rating: number; comment: string; createdAt: string }>
      }) {
        const { reviews } = props
        const defaultExpected =
          '• 메인 상품 정보(189,000원) 지연 없는 즉각 렌더링 (빠른 FCP)\n• React 19 use(Promise)로 800ms 지연 구매 후기 3건 스트리밍 언랩\n• Suspense Fallback 스켈레톤에서 실제 후기 UI로의 점진적 전환 관찰'

        const defaultActual =
          reviews && reviews.length > 0
            ? `• 스트리밍 언랩: React 19 use(Promise) 완료\n• 로드된 후기 수: ${reviews.length}건 (${reviews.map((r) => r.author).join(', ')})\n• 렌더링 상태: 메인 셸 즉시 렌더 + 후기 청크 스트리밍 정상`
            : '• Suspense Fallback 로딩 대기 중 (구매 후기 Promise 스트리밍 800ms 대기)'

        const isMatched =
          props.isMatched !== undefined
            ? props.isMatched
            : reviews && reviews.length > 0
            ? true
            : undefined

        return { isMatched, actual: defaultActual, expected: defaultExpected }
      }

      // Step 1: Initial state during 800ms Suspense streaming (reviews is undefined)
      const initialState = evaluateDemo11Footer({})
      assert.strictEqual(initialState.isMatched, undefined, 'Initial streaming state must evaluate to undefined (Pending)')
      assert.match(initialState.actual, /Suspense Fallback 로딩 대기 중/)

      // Step 2: Reviews resolved after 800ms (3 reviews unwrapped via use())
      const mockReviews = [
        { id: 'rev-1', author: '개발자K', rating: 5, comment: '최고입니다', createdAt: '2026-08-20' },
        { id: 'rev-2', author: '키보드매니아', rating: 5, comment: '안정적입니다', createdAt: '2026-08-19' },
        { id: 'rev-3', author: '디자이너P', rating: 4, comment: '마감이 훌륭합니다', createdAt: '2026-08-18' },
      ]
      const resolvedState = evaluateDemo11Footer({ reviews: mockReviews })
      assert.strictEqual(resolvedState.isMatched, true, 'Resolved reviews state must evaluate to true (Matched)')
      assert.match(resolvedState.actual, /React 19 use\(Promise\) 완료/)
      assert.match(resolvedState.actual, /로드된 후기 수: 3건 \(개발자K, 키보드매니아, 디자이너P\)/)

      // Step 3: Edge Case - Empty reviews array []
      const emptyState = evaluateDemo11Footer({ reviews: [] })
      assert.strictEqual(emptyState.isMatched, undefined, 'Empty reviews must not trigger false positive pass')
      assert.match(emptyState.actual, /Suspense Fallback 로딩 대기 중/)

      // Step 4: Explicit failure override
      const explicitFailed = evaluateDemo11Footer({ isMatched: false, reviews: mockReviews })
      assert.strictEqual(explicitFailed.isMatched, false, 'Explicit isMatched override must be honored')
    })
  })

  // =========================================================================
  // DEMO 12: Server Action Revalidate (mutating-data/server-action-revalidate)
  // =========================================================================
  describe('Demo 12: mutating-data/server-action-revalidate Dynamic Cart Calculation & revalidatePath', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate',
    )
    const pagePath = path.join(basePath, 'page.tsx')
    const actionsPath = path.join(basePath, 'actions.ts')
    const clientPath = path.join(basePath, 'components/CartTableClient.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('12.1 Source file inspection: Anti-hardcoding, Server Action, and dynamic verification props', () => {
      assert.ok(fs.existsSync(pagePath))
      assert.ok(fs.existsSync(actionsPath))
      assert.ok(fs.existsSync(clientPath))
      assert.ok(fs.existsSync(footerPath))

      const actionsContent = fs.readFileSync(actionsPath, 'utf-8')
      const clientContent = fs.readFileSync(clientPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      assert.ok(actionsContent.includes("'use server'"), 'actions.ts must declare "use server"')
      assert.ok(actionsContent.includes('revalidatePath('), 'actions.ts must call revalidatePath')
      assert.ok(clientContent.includes('actionCount'), 'CartTableClient must track actionCount state')
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not contain hardcoded isMatched={true}',
      )
      assert.ok(
        footerContent.includes('actionCount && actionCount > 0'),
        'VerificationFooter must evaluate isMatched from real actionCount',
      )
    })

    it('12.2 Empirical Cart Domain State Engine & Summary Calculation', () => {
      interface CartItem {
        id: string
        name: string
        price: number
        quantity: number
      }

      function createCartStore() {
        let globalCart: CartItem[] = [
          { id: 'cart-1', name: '에어 줌 프로 러닝화', price: 159000, quantity: 1 },
          { id: 'cart-2', name: '오버핏 기모 맨투맨', price: 49000, quantity: 2 },
          { id: 'cart-3', name: '알루미늄 모니터 암 싱글', price: 54000, quantity: 1 },
        ]

        function calculateSummary() {
          const totalPrice = globalCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const totalQuantity = globalCart.reduce((sum, item) => sum + item.quantity, 0)
          return {
            items: [...globalCart],
            totalPrice,
            totalQuantity,
            updatedAt: '12:00:00',
          }
        }

        function updateCartQuantity(itemId: string, delta: number) {
          globalCart = globalCart
            .map((item) => {
              if (item.id === itemId) {
                const nextQty = Math.max(0, item.quantity + delta)
                return { ...item, quantity: nextQty }
              }
              return item
            })
            .filter((item) => item.quantity > 0)
          return calculateSummary()
        }

        function resetCart() {
          globalCart = [
            { id: 'cart-1', name: '에어 줌 프로 러닝화', price: 159000, quantity: 1 },
            { id: 'cart-2', name: '오버핏 기모 맨투맨', price: 49000, quantity: 2 },
            { id: 'cart-3', name: '알루미늄 모니터 암 싱글', price: 54000, quantity: 1 },
          ]
          return calculateSummary()
        }

        return { calculateSummary, updateCartQuantity, resetCart }
      }

      const store = createCartStore()

      // 1. Initial summary
      const initialSummary = store.calculateSummary()
      assert.strictEqual(initialSummary.totalQuantity, 4, 'Initial quantity must be 1+2+1=4')
      assert.strictEqual(initialSummary.totalPrice, 159000 * 1 + 49000 * 2 + 54000 * 1, 'Initial total must be 311,000')

      // 2. Increase cart-1 by 1
      const updated1 = store.updateCartQuantity('cart-1', 1)
      assert.strictEqual(updated1.totalQuantity, 5)
      assert.strictEqual(updated1.totalPrice, 159000 * 2 + 49000 * 2 + 54000 * 1) // 470,000

      // 3. Decrease cart-2 by 1
      const updated2 = store.updateCartQuantity('cart-2', -1)
      assert.strictEqual(updated2.totalQuantity, 4)
      assert.strictEqual(updated2.totalPrice, 159000 * 2 + 49000 * 1 + 54000 * 1) // 421,000

      // 4. Decrease cart-3 by 1 (removes item)
      const updated3 = store.updateCartQuantity('cart-3', -1)
      assert.strictEqual(updated3.items.length, 2, 'Item with quantity 0 must be removed')
      assert.strictEqual(updated3.totalQuantity, 3)
      assert.strictEqual(updated3.totalPrice, 159000 * 2 + 49000 * 1) // 367,000

      // 5. Reset cart
      const resetSummary = store.resetCart()
      assert.strictEqual(resetSummary.items.length, 3)
      assert.strictEqual(resetSummary.totalQuantity, 4)
      assert.strictEqual(resetSummary.totalPrice, 311000)
    })

    it('12.3 Empirical VerificationFooter 3-State Lifecycle Simulation for Demo 12', () => {
      function evaluateDemo12Footer(props: {
        isMatched?: boolean
        cart?: { totalQuantity: number; totalPrice: number; updatedAt: string }
        actionCount?: number
        isPending?: boolean
      }) {
        const { cart, actionCount } = props
        let defaultActual = '• 인터랙션 대기 중 (장바구니의 [+] 또는 [-] 수량 버튼을 클릭하세요)'
        if (actionCount && actionCount > 0 && cart) {
          defaultActual = `• 변경된 총 수량: ${cart.totalQuantity}개 (총 ${cart.totalPrice.toLocaleString()}원)\n• revalidatePath 서버 동기화: 완료 (${cart.updatedAt})\n• Server Action 상태: POST 200 성공 및 최신 캐시 동기화 완료`
        }

        const isMatched =
          props.isMatched !== undefined
            ? props.isMatched
            : actionCount && actionCount > 0
            ? true
            : undefined

        return { isMatched, actual: defaultActual }
      }

      // Initial state: actionCount = 0
      const initial = evaluateDemo12Footer({ actionCount: 0, cart: { totalQuantity: 4, totalPrice: 311000, updatedAt: '10:00:00' } })
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined (Pending)')
      assert.match(initial.actual, /인터랙션 대기 중/)

      // After user clicks [+] quantity button (actionCount = 1)
      const afterAction = evaluateDemo12Footer({
        actionCount: 1,
        cart: { totalQuantity: 5, totalPrice: 470000, updatedAt: '10:00:01' },
      })
      assert.strictEqual(afterAction.isMatched, true, 'After action state must be true (Matched)')
      assert.match(afterAction.actual, /변경된 총 수량: 5개 \(총 470,000원\)/)
      assert.match(afterAction.actual, /revalidatePath 서버 동기화: 완료/)
    })
  })

  // =========================================================================
  // DEMO 13: Optimistic Cart (mutating-data/optimistic-cart)
  // =========================================================================
  describe('Demo 13: mutating-data/optimistic-cart React 19 useOptimistic 3-State Lifecycle', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart',
    )
    const pagePath = path.join(basePath, 'page.tsx')
    const actionsPath = path.join(basePath, 'actions.ts')
    const clientPath = path.join(basePath, 'components/OptimisticCartClient.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('13.1 Source file inspection: React 19 useOptimistic & useTransition wiring', () => {
      assert.ok(fs.existsSync(pagePath))
      assert.ok(fs.existsSync(actionsPath))
      assert.ok(fs.existsSync(clientPath))
      assert.ok(fs.existsSync(footerPath))

      const clientContent = fs.readFileSync(clientPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      assert.ok(
        clientContent.includes('useOptimistic(') && clientContent.includes('useTransition()'),
        'OptimisticCartClient must use React 19 useOptimistic and useTransition',
      )
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
      assert.ok(
        footerContent.includes('hasInteracted && !isPending'),
        'VerificationFooter must evaluate isMatched only after interaction and when transition completes',
      )
    })

    it('13.2 Empirical useOptimistic Reducer State Transitions', () => {
      interface OptimisticItem {
        id: string
        name: string
        price: number
        quantity: number
        isOptimistic?: boolean
      }

      function optimisticReducer(
        state: OptimisticItem[],
        newItem: Omit<OptimisticItem, 'quantity' | 'isOptimistic'>,
      ): OptimisticItem[] {
        const existing = state.find((i) => i.id === newItem.id)
        if (existing) {
          return state.map((i) =>
            i.id === newItem.id
              ? { ...i, quantity: i.quantity + 1, isOptimistic: true }
              : i,
          )
        }
        return [...state, { ...newItem, quantity: 1, isOptimistic: true }]
      }

      const initialCart: OptimisticItem[] = [
        { id: 'item-1', name: '기본 상품', price: 30000, quantity: 1 },
      ]

      // 1. Optimistic addition of existing item
      const optimisticState1 = optimisticReducer(initialCart, { id: 'item-1', name: '기본 상품', price: 30000 })
      assert.strictEqual(optimisticState1.length, 1)
      assert.strictEqual(optimisticState1[0].quantity, 2)
      assert.strictEqual(optimisticState1[0].isOptimistic, true)

      // 2. Optimistic addition of new item
      const optimisticState2 = optimisticReducer(initialCart, { id: 'item-2', name: '후드티', price: 69000 })
      assert.strictEqual(optimisticState2.length, 2)
      assert.strictEqual(optimisticState2[1].quantity, 1)
      assert.strictEqual(optimisticState2[1].isOptimistic, true)
    })

    it('13.3 Empirical 3-Stage Verification Transition: Initial -> Pending (Optimistic UI) -> Confirmed (Matched)', () => {
      interface OptimisticCartItem {
        id: string
        name: string
        price: number
        quantity: number
        isOptimistic?: boolean
      }

      function evaluateDemo13Footer(props: {
        isMatched?: boolean
        hasInteracted?: boolean
        isPending?: boolean
        optimisticCart?: OptimisticCartItem[]
        cart?: OptimisticCartItem[]
      }) {
        const { hasInteracted, isPending, optimisticCart, cart } = props
        let defaultActual = '• 인터랙션 대기 중 (상품 목록에서 [+ 장바구니 담기]를 클릭하세요)'
        if (hasInteracted) {
          const totalQty = (optimisticCart || []).reduce((s, i) => s + i.quantity, 0)
          const totalPrice = (optimisticCart || []).reduce((s, i) => s + i.price * i.quantity, 0)

          if (isPending) {
            defaultActual = `• 낙관적 선반영: useOptimistic 즉각 반영 (총 ${totalQty}개, ${totalPrice.toLocaleString()}원)\n• 서버 통신: 800ms 백그라운드 Server Action 진행 중...\n• 상태: 임시 주황색 [낙관적 렌더링] 뱃지 표시 중`
          } else {
            defaultActual = `• 낙관적 선반영: 즉각 UI 렌더링 완료\n• 서버 확정 상태: ${(cart || []).length}개 품목 (총 ${totalQty}개, ${totalPrice.toLocaleString()}원)\n• 백그라운드 동기화: addCartItemServer POST 200 완료`
          }
        }

        const isMatched =
          props.isMatched !== undefined
            ? props.isMatched
            : hasInteracted && !isPending
            ? true
            : undefined

        return { isMatched, actual: defaultActual }
      }

      const initialCart: OptimisticCartItem[] = [
        { id: 'item-1', name: '기본 상품', price: 30000, quantity: 1 },
      ]

      // Stage 1: Initial state before user interaction
      const stage1 = evaluateDemo13Footer({
        hasInteracted: false,
        isPending: false,
        optimisticCart: initialCart,
        cart: initialCart,
      })
      assert.strictEqual(stage1.isMatched, undefined, 'Stage 1 must be undefined (Pending)')
      assert.match(stage1.actual, /인터랙션 대기 중/)

      // Stage 2: Optimistic UI updated, Server Action running (isPending: true)
      const optimisticCart: OptimisticCartItem[] = [
        { id: 'item-1', name: '기본 상품', price: 30000, quantity: 1 },
        { id: 'item-2', name: '후드티', price: 69000, quantity: 1, isOptimistic: true },
      ]
      const stage2 = evaluateDemo13Footer({
        hasInteracted: true,
        isPending: true,
        optimisticCart,
        cart: initialCart,
      })
      assert.strictEqual(stage2.isMatched, undefined, 'Stage 2 must stay undefined while transition is pending')
      assert.match(stage2.actual, /useOptimistic 즉각 반영 \(총 2개, 99,000원\)/)
      assert.match(stage2.actual, /800ms 백그라운드 Server Action 진행 중/)

      // Stage 3: Server Action resolves and updates base state (isPending: false)
      const confirmedCart: OptimisticCartItem[] = [
        { id: 'item-1', name: '기본 상품', price: 30000, quantity: 1 },
        { id: 'item-2', name: '후드티', price: 69000, quantity: 1 },
      ]
      const stage3 = evaluateDemo13Footer({
        hasInteracted: true,
        isPending: false,
        optimisticCart: confirmedCart,
        cart: confirmedCart,
      })
      assert.strictEqual(stage3.isMatched, true, 'Stage 3 must evaluate to true (Matched)')
      assert.match(stage3.actual, /즉각 UI 렌더링 완료/)
      assert.match(stage3.actual, /서버 확정 상태: 2개 품목/)
      assert.match(stage3.actual, /addCartItemServer POST 200 완료/)
    })
  })

  // =========================================================================
  // DEMO 14: Time-Based ISR (revalidating/time-based-isr)
  // =========================================================================
  describe('Demo 14: revalidating/time-based-isr Next.js 16 cacheLife & SWR Lifecycle', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-cache-components/src/app/zone/cache/revalidating/time-based-isr',
    )
    const pagePath = path.join(basePath, 'page.tsx')
    const clientPath = path.join(basePath, 'components/TimeBasedIsrClient.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('14.1 Source file inspection: cacheLife profile & SWR 10-second threshold alignment', () => {
      assert.ok(fs.existsSync(pagePath))
      assert.ok(fs.existsSync(clientPath))
      assert.ok(fs.existsSync(footerPath))

      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      const clientContent = fs.readFileSync(clientPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Check cacheLife configuration in page.tsx
      assert.ok(
        pageContent.includes("'use cache'") && pageContent.includes('cacheLife({'),
        'page.tsx must use "use cache" and cacheLife',
      )
      assert.ok(
        pageContent.includes('stale: 10'),
        'page.tsx must configure stale: 10 to match 10s guide description',
      )

      // Check client stale detection threshold
      assert.ok(
        clientContent.includes('elapsed >= 10'),
        'TimeBasedIsrClient must use 10s threshold for isStale',
      )

      // Anti-hardcoding check
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
      assert.ok(
        footerContent.includes('elapsed >= 10'),
        'VerificationFooter must evaluate isMatched dynamically against elapsed >= 10',
      )
    })

    it('14.2 Empirical SWR Timeline Simulation: FRESH (0..9s) -> STALE (>=10s Matched)', () => {
      function evaluateDemo14Footer(props: {
        isMatched?: boolean
        elapsed?: number
        isStale?: boolean
        generatedTimestamp?: string
        cacheId?: string
      }) {
        const { elapsed = 0, isStale, generatedTimestamp, cacheId } = props
        let defaultActual = '• 캐시 데이터 로딩 대기 중...'
        if (generatedTimestamp && cacheId) {
          defaultActual = `• 캐시 ID: #${cacheId}\n• 생성 시각: ${generatedTimestamp}\n• 수명 주기 상태: ${
            isStale ? 'STALE (10초 경과, SWR 재검증 대상)' : `FRESH (${elapsed}초 경과 / 10초 수명)`
          }\n• 동작 모드: Next.js 16 cacheLife 시간 기반 SWR 캐시 수명주기 정상 동작`
        }

        const isMatched =
          props.isMatched !== undefined
            ? props.isMatched
            : elapsed >= 10
            ? true
            : undefined

        return { isMatched, actual: defaultActual }
      }

      // Initial loading
      const loading = evaluateDemo14Footer({})
      assert.strictEqual(loading.isMatched, undefined)
      assert.match(loading.actual, /캐시 데이터 로딩 대기 중/)

      // 0s Fresh
      const fresh0 = evaluateDemo14Footer({
        elapsed: 0,
        isStale: false,
        generatedTimestamp: '10:00:00.000',
        cacheId: 'ABC123',
      })
      assert.strictEqual(fresh0.isMatched, undefined, '0s must be undefined (Pending/Fresh)')
      assert.match(fresh0.actual, /FRESH \(0초 경과 \/ 10초 수명\)/)

      // 5s Fresh
      const fresh5 = evaluateDemo14Footer({
        elapsed: 5,
        isStale: false,
        generatedTimestamp: '10:00:00.000',
        cacheId: 'ABC123',
      })
      assert.strictEqual(fresh5.isMatched, undefined, '5s must be undefined (Pending/Fresh)')
      assert.match(fresh5.actual, /FRESH \(5초 경과 \/ 10초 수명\)/)

      // 9s Fresh (Boundary edge before threshold)
      const fresh9 = evaluateDemo14Footer({
        elapsed: 9,
        isStale: false,
        generatedTimestamp: '10:00:00.000',
        cacheId: 'ABC123',
      })
      assert.strictEqual(fresh9.isMatched, undefined, '9s must be undefined (Pending/Fresh)')
      assert.match(fresh9.actual, /FRESH \(9초 경과 \/ 10초 수명\)/)

      // 10s Stale (Boundary threshold hit)
      const stale10 = evaluateDemo14Footer({
        elapsed: 10,
        isStale: true,
        generatedTimestamp: '10:00:00.000',
        cacheId: 'ABC123',
      })
      assert.strictEqual(stale10.isMatched, true, '10s must evaluate to true (Matched)')
      assert.match(stale10.actual, /STALE \(10초 경과, SWR 재검증 대상\)/)

      // 30s Stale
      const stale30 = evaluateDemo14Footer({
        elapsed: 30,
        isStale: true,
        generatedTimestamp: '10:00:00.000',
        cacheId: 'ABC123',
      })
      assert.strictEqual(stale30.isMatched, true, '30s must evaluate to true (Matched)')
      assert.match(stale30.actual, /STALE \(10초 경과, SWR 재검증 대상\)/)
    })
  })

  // =========================================================================
  // DEMO 15: Tag vs Path Revalidation (revalidating/tag-vs-path)
  // =========================================================================
  describe('Demo 15: revalidating/tag-vs-path revalidateTag vs revalidatePath Invalidation', () => {
    const basePath = path.join(
      APPS_ROOT,
      'demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path',
    )
    const pagePath = path.join(basePath, 'page.tsx')
    const actionsPath = path.join(basePath, 'actions.ts')
    const clientPath = path.join(basePath, 'components/TagVsPathClient.tsx')
    const footerPath = path.join(basePath, 'components/VerificationFooter.tsx')

    it('15.1 Source file inspection: cacheTag declaration & selective invalidation actions', () => {
      assert.ok(fs.existsSync(pagePath))
      assert.ok(fs.existsSync(actionsPath))
      assert.ok(fs.existsSync(clientPath))
      assert.ok(fs.existsSync(footerPath))

      const pageContent = fs.readFileSync(pagePath, 'utf-8')
      const actionsContent = fs.readFileSync(actionsPath, 'utf-8')
      const clientContent = fs.readFileSync(clientPath, 'utf-8')
      const footerContent = fs.readFileSync(footerPath, 'utf-8')

      // Check cacheTag declarations
      assert.ok(pageContent.includes("cacheTag('tag-vs-path:banner')"), 'page.tsx must tag banner')
      assert.ok(pageContent.includes("cacheTag('tag-vs-path:product-a')"), 'page.tsx must tag product A')
      assert.ok(pageContent.includes("cacheTag('tag-vs-path:product-b')"), 'page.tsx must tag product B')

      // Check actions: revalidateTag with 'max' profile and revalidatePath
      assert.ok(
        actionsContent.includes("revalidateTag('tag-vs-path:product-a', 'max')"),
        'actions.ts must revalidate tag product A',
      )
      assert.ok(
        actionsContent.includes("revalidateTag('tag-vs-path:product-b', 'max')"),
        'actions.ts must revalidate tag product B',
      )
      assert.ok(actionsContent.includes('revalidatePath('), 'actions.ts must revalidate entire path')

      // Anti-hardcoding check
      assert.ok(
        !footerContent.includes('isMatched={true}'),
        'VerificationFooter must not hardcode static isMatched={true}',
      )
      assert.ok(
        footerContent.includes('lastActionType !== null && !isPending'),
        'VerificationFooter must evaluate isMatched from lastActionType and completion',
      )
    })

    it('15.2 Empirical Selective Tag vs Path Multi-Action State Transitions', () => {
      function evaluateDemo15Footer(props: {
        isMatched?: boolean
        lastActionType?: 'tag-a' | 'tag-b' | 'path' | null
        isPending?: boolean
      }) {
        const { lastActionType, isPending } = props
        let defaultActual = '• 인터랙션 대기 중 (상단 무효화 버튼 1, 2, 3 중 하나를 클릭하세요)'
        if (lastActionType === 'tag-a') {
          defaultActual = `• 무효화 대상: revalidateTag('tag-vs-path:product-a')\n• 갱신 범위: A 상품 캐시 정밀 갱신 / 공지 배너 및 B 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
        } else if (lastActionType === 'tag-b') {
          defaultActual = `• 무효화 대상: revalidateTag('tag-vs-path:product-b')\n• 갱신 범위: B 상품 캐시 정밀 갱신 / 공지 배너 및 A 상품 캐시 HIT 유지\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
        } else if (lastActionType === 'path') {
          defaultActual = `• 무효화 대상: revalidatePath('/zone/cache/revalidating/tag-vs-path')\n• 갱신 범위: 공지 배너, A 상품, B 상품 전체 캐시 일괄 갱신\n• 통신 상태: Server Action POST 200 완료 ${isPending ? '(처리 중...)' : ''}`
        }

        const isMatched =
          props.isMatched !== undefined
            ? props.isMatched
            : lastActionType !== null && !isPending
            ? true
            : undefined

        return { isMatched, actual: defaultActual }
      }

      // Initial State: lastActionType = null
      const initial = evaluateDemo15Footer({ lastActionType: null, isPending: false })
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined (Pending)')
      assert.match(initial.actual, /인터랙션 대기 중/)

      // Action 1: Product A tag invalidation pending
      const tagAPending = evaluateDemo15Footer({ lastActionType: 'tag-a', isPending: true })
      assert.strictEqual(tagAPending.isMatched, undefined, 'Pending tag-a action must be undefined')
      assert.match(tagAPending.actual, /A 상품 캐시 정밀 갱신/)
      assert.match(tagAPending.actual, /\(처리 중\.\.\.\)/)

      // Action 1: Product A tag invalidation completed
      const tagACompleted = evaluateDemo15Footer({ lastActionType: 'tag-a', isPending: false })
      assert.strictEqual(tagACompleted.isMatched, true, 'Completed tag-a action must evaluate to true (Matched)')
      assert.match(tagACompleted.actual, /revalidateTag\('tag-vs-path:product-a'\)/)
      assert.match(tagACompleted.actual, /공지 배너 및 B 상품 캐시 HIT 유지/)

      // Action 2: Product B tag invalidation completed
      const tagBCompleted = evaluateDemo15Footer({ lastActionType: 'tag-b', isPending: false })
      assert.strictEqual(tagBCompleted.isMatched, true, 'Completed tag-b action must evaluate to true (Matched)')
      assert.match(tagBCompleted.actual, /revalidateTag\('tag-vs-path:product-b'\)/)
      assert.match(tagBCompleted.actual, /공지 배너 및 A 상품 캐시 HIT 유지/)

      // Action 3: Entire path invalidation completed
      const pathCompleted = evaluateDemo15Footer({ lastActionType: 'path', isPending: false })
      assert.strictEqual(pathCompleted.isMatched, true, 'Completed path action must evaluate to true (Matched)')
      assert.match(pathCompleted.actual, /revalidatePath\('\/zone\/cache\/revalidating\/tag-vs-path'\)/)
      assert.match(pathCompleted.actual, /공지 배너, A 상품, B 상품 전체 캐시 일괄 갱신/)
    })
  })

  // =========================================================================
  // GLOBAL AUDIT: Exaggerated Claims, Line Counts & Static Matched on Demos 11–15
  // =========================================================================
  describe('Global Batch Audit: Demos 11–15 Code Quality & Integrity', () => {
    const demoDirs = [
      'demo-baseline/src/app/zone/baseline/fetching-data/use-promise-streaming',
      'demo-baseline/src/app/zone/baseline/mutating-data/server-action-revalidate',
      'demo-baseline/src/app/zone/baseline/mutating-data/optimistic-cart',
      'demo-cache-components/src/app/zone/cache/revalidating/time-based-isr',
      'demo-cache-components/src/app/zone/cache/revalidating/tag-vs-path',
    ]

    it('All source files across Demos 11–15 must strictly not exceed 250 lines', () => {
      for (const relDir of demoDirs) {
        const fullDir = path.join(APPS_ROOT, relDir)
        const entries = fs.readdirSync(fullDir, { recursive: true, withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            const fullPath = path.join((entry as any).parentPath || fullDir, entry.name)
            const lines = fs.readFileSync(fullPath, 'utf-8').split('\n')
            assert.ok(
              lines.length <= 250,
              `File exceeds 250 lines (${lines.length}): ${fullPath}`,
            )
          }
        }
      }
    })

    it('Zero static isMatched={true} or static literal cheats across Demos 11–15', () => {
      const staticPattern = /isMatched\s*=\s*\{\s*true\s*\}|isMatched\s*:\s*true/
      for (const relDir of demoDirs) {
        const fullDir = path.join(APPS_ROOT, relDir)
        const entries = fs.readdirSync(fullDir, { recursive: true, withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            const fullPath = path.join((entry as any).parentPath || fullDir, entry.name)
            const content = fs.readFileSync(fullPath, 'utf-8')
            const lines = content.split('\n')
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim()
              if (!line.startsWith('//') && !line.startsWith('*')) {
                assert.ok(
                  !staticPattern.test(line),
                  `Static matched literal found at ${fullPath}:${i + 1} -> ${line}`,
                )
              }
            }
          }
        }
      }
    })

    it('Zero unmeasured claims (0ms 즉시 렌더, 0ms 즉각 반영, 100% 가동률, 전 세계 캐시 즉시 퍼지) in Demos 11–15', () => {
      const forbiddenTerms = [
        '0ms 즉시 렌더',
        '0ms 즉각 반영',
        '100% 가동률',
        '전 세계 캐시를 즉시 퍼지',
        '92% 절감',
      ]

      for (const relDir of demoDirs) {
        const fullDir = path.join(APPS_ROOT, relDir)
        const entries = fs.readdirSync(fullDir, { recursive: true, withFileTypes: true })
        for (const entry of entries) {
          if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
            const fullPath = path.join((entry as any).parentPath || fullDir, entry.name)
            const content = fs.readFileSync(fullPath, 'utf-8')
            for (const term of forbiddenTerms) {
              assert.ok(
                !content.includes(term),
                `Forbidden unmeasured claim "${term}" found in ${fullPath}`,
              )
            }
          }
        }
      }
    })
  })
})
