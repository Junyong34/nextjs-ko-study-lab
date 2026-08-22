import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const BASELINE_SRC = path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src')
const CACHE_SRC = path.join(NEXTJS_APP_ROOT, 'apps/demo-cache-components/src')

describe('Tier 5 Adversarial Hardening — 02: 8 E-Commerce Outlier Scenarios Realignment', () => {
  // Outlier 1: styling/tailwind-v4
  it('Outlier 1: should verify tailwind-v4 e-commerce theme inspector and real dynamic tokens', () => {
    const componentPath = path.join(
      BASELINE_SRC,
      'app/zone/baseline/css/tailwind-v4/components/ThemeInspectorClient.tsx'
    )
    assert.ok(fs.existsSync(componentPath), `Component must exist at ${componentPath}`)

    const content = fs.readFileSync(componentPath, 'utf-8')
    assert.ok(content.includes('Tailwind CSS v4 프로 레이싱 러닝화'), 'Must contain e-commerce product title')
    assert.ok(content.includes('189,000원'), 'Must contain price')
    assert.ok(content.includes('장바구니 담기'), 'Must contain add to cart action')
    assert.ok(content.includes('sizes = [250, 260, 270, 280, 290]'), 'Must contain shoe sizes')
  })

  // Outlier 2: styling/css-modules
  it('Outlier 2: should verify css-modules e-commerce product cards and scoped module CSS', () => {
    const cardPath = path.join(
      BASELINE_SRC,
      'app/zone/baseline/css/css-modules/components/ProductCard.tsx'
    )
    const cssPath = path.join(
      BASELINE_SRC,
      'app/zone/baseline/css/css-modules/components/ProductCard.module.css'
    )
    assert.ok(fs.existsSync(cardPath), `ProductCard must exist at ${cardPath}`)
    assert.ok(fs.existsSync(cssPath), `CSS module must exist at ${cssPath}`)

    const cardContent = fs.readFileSync(cardPath, 'utf-8')
    assert.ok(cardContent.includes('프로 무선 기계식 키보드'), 'Must contain e-commerce product title')
    assert.ok(cardContent.includes('189,000원'), 'Must contain price')
    assert.ok(cardContent.includes('styles.card'), 'Must use scoped CSS module class')

    const cssContent = fs.readFileSync(cssPath, 'utf-8')
    assert.ok(cssContent.includes('.card'), 'CSS module must define .card')
    assert.ok(cssContent.includes('.badge'), 'CSS module must define .badge')
  })

  // Outlier 3: architecture/fast-refresh-boundary
  it('Outlier 3: should verify fast-refresh-boundary e-commerce state preservation counter and input', () => {
    const counterPath = path.join(
      BASELINE_SRC,
      'app/zone/baseline/architecture/fast-refresh-boundary/components/StatePreservingCounter.tsx'
    )
    assert.ok(fs.existsSync(counterPath), `StatePreservingCounter must exist at ${counterPath}`)

    const content = fs.readFileSync(counterPath, 'utf-8')
    assert.ok(content.includes('장바구니') && content.includes('주문 수량'), 'Must contain shopping cart and order quantity state')
    assert.ok(content.includes('인체공학 무선 버티컬 마우스'), 'Must contain e-commerce product item')
    assert.ok(content.includes('useState'), 'Must preserve state via React useState')
    assert.ok(content.includes('Fast Refresh') || content.includes('HMR'), 'Must explain HMR state preservation')
  })

  // Outlier 4: guides/migrating-cache-components/cache-key-compare
  it('Outlier 4: should verify cache-key-compare e-commerce discount tiers, SKU and AST hash comparison', () => {
    const demoPath = path.join(
      CACHE_SRC,
      'app/zone/cache/guides/migrating-cache-components/cache-key-compare/components/CacheKeyCompareDemo.tsx'
    )
    assert.ok(fs.existsSync(demoPath), `CacheKeyCompareDemo must exist at ${demoPath}`)

    const content = fs.readFileSync(demoPath, 'utf-8')
    assert.ok(content.includes('NORMAL'), 'Must support NORMAL member tier')
    assert.ok(content.includes('VIP'), 'Must support VIP member tier')
    assert.ok(content.includes('VVIP'), 'Must support VVIP member tier')
    assert.ok(content.includes('KRW') && content.includes('USD'), 'Must support multi-currency')
    assert.ok(content.includes('unstable_cache'), 'Must demonstrate legacy manual cache key')
    assert.ok(content.includes("'use cache'"), 'Must demonstrate Next.js 16 AST auto-hashing')
  })

  // Outlier 5: guides/tanstack-query/ssr-hydration
  it('Outlier 5: should verify tanstack-query/ssr-hydration e-commerce prefetch & zero-spinner hydration', () => {
    const demoPath = path.join(
      BASELINE_SRC,
      'app/zone/baseline/guides/tanstack-query/ssr-hydration/components/TanstackSsrDemo.tsx'
    )
    assert.ok(fs.existsSync(demoPath), `TanstackSsrDemo must exist at ${demoPath}`)

    const content = fs.readFileSync(demoPath, 'utf-8')
    assert.ok(content.includes('MOCK_PRODUCTS'), 'Must use shared e-commerce catalog')
    assert.ok(content.includes('HydrationBoundary') || content.includes('SSR Hydrated'), 'Must demonstrate SSR hydration')
    assert.ok(content.includes('categories'), 'Must support category filtering')
    assert.ok(content.includes('cacheHits'), 'Must track query cache hits')
  })

  // Outlier 6: directives/use-cache/function-cache
  it('Outlier 6: should verify function-cache e-commerce product caching and revalidateTag purging', () => {
    const demoPath = path.join(
      CACHE_SRC,
      'app/zone/cache/directives/use-cache/function-cache/components/DirectiveUseCacheFunctionDemo.tsx'
    )
    assert.ok(fs.existsSync(demoPath), `DirectiveUseCacheFunctionDemo must exist at ${demoPath}`)

    const content = fs.readFileSync(demoPath, 'utf-8')
    assert.ok(content.includes('MOCK_PRODUCTS'), 'Must use e-commerce products')
    assert.ok(content.includes('revalidateTag'), 'Must demonstrate cache tag revalidation')
    assert.ok(content.includes('CACHE HIT') && content.includes('CACHE MISS'), 'Must track HIT/MISS telemetry')
  })

  // Outlier 7: directives/use-cache/component-jsx-cache
  it('Outlier 7: should verify component-jsx-cache e-commerce bestseller ranking RSC payload cache', () => {
    const demoPath = path.join(
      CACHE_SRC,
      'app/zone/cache/directives/use-cache/component-jsx-cache/components/DirectiveUseCacheComponentDemo.tsx'
    )
    assert.ok(fs.existsSync(demoPath), `DirectiveUseCacheComponentDemo must exist at ${demoPath}`)

    const content = fs.readFileSync(demoPath, 'utf-8')
    assert.ok(content.includes('BestSellerRankingHero') || content.includes('종합 베스트'), 'Must contain bestseller e-commerce component')
    assert.ok(content.includes('RSC Payload') || content.includes('JSX CACHE HIT'), 'Must explain JSX tree serialization')
  })

  // Outlier 8: directives/use-cache/remote-redis-cache
  it('Outlier 8: should verify remote-redis-cache e-commerce multi-instance flash sale inventory sync', () => {
    const demoPath = path.join(
      CACHE_SRC,
      'app/zone/cache/directives/use-cache/remote-redis-cache/components/DirectiveUseCacheRemoteDemo.tsx'
    )
    assert.ok(fs.existsSync(demoPath), `DirectiveUseCacheRemoteDemo must exist at ${demoPath}`)

    const content = fs.readFileSync(demoPath, 'utf-8')
    assert.ok(content.includes('REDIS REMOTE') || content.includes('CacheHandler'), 'Must demonstrate Redis remote cache')
    assert.ok(content.includes('Seoul') && content.includes('Tokyo'), 'Must demonstrate multi-region distributed pods')
    assert.ok(content.includes('remoteStock') || content.includes('잔여 재고'), 'Must track distributed atomic stock')
    assert.ok(content.includes('품절 (매진)'), 'Must guard against negative stock')
  })
})
