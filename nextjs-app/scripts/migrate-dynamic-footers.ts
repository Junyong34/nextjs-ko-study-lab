import fs from 'node:fs'
import path from 'node:path'
import { getAllFiles, NEXTJS_APP_ROOT } from '../packages/test-suite/src/utils/test-helpers.ts'

// 1. Update caching/basic/page.tsx
const cachingBasicPage = path.join(NEXTJS_APP_ROOT, 'apps/demo-cache-components/src/app/zone/cache/caching/basic/page.tsx')
if (fs.existsSync(cachingBasicPage)) {
  let content = fs.readFileSync(cachingBasicPage, 'utf8')
  content = content.replace('isMatched={true}', 'isMatched={Boolean(cachedData && cachedData.cacheId)}')
  fs.writeFileSync(cachingBasicPage, content, 'utf8')
  console.log('Updated caching/basic/page.tsx')
}

// 2. Update 7 custom files
const customUpdates = [
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/components/VerificationFooter.tsx',
    from: 'isMatched={currentSlug ? isMatched : true}',
    to: 'isMatched={currentSlug ? isMatched : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/optional-catch-all/components/VerificationFooter.tsx',
    from: 'isMatched={true}',
    to: 'isMatched={isDocsRoute ? true : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/single-param/components/VerificationFooter.tsx',
    from: 'isMatched={currentId ? isMatched : true}',
    to: 'isMatched={currentId ? isMatched : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/error/payment-error-boundary/components/VerificationFooter.tsx',
    from: 'isMatched={true}',
    to: 'isMatched={isErrorCaught ? true : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/components/VerificationFooter.tsx',
    from: 'isMatched={true}',
    to: 'isMatched={isDirectPage || Boolean(currentPhotoId) ? true : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/loading/skeleton-boundary/components/VerificationFooter.tsx',
    from: 'isMatched={isLoaded ? Boolean(elapsedMs && elapsedMs > 0) : true}',
    to: 'isMatched={isLoaded ? Boolean(elapsedMs && elapsedMs > 0) : undefined}',
  },
  {
    file: 'apps/demo-baseline/src/app/zone/baseline/file-conventions/not-found/missing-product-404/components/VerificationFooter.tsx',
    from: 'isMatched={true}',
    to: 'isMatched={productId ? isValidProduct : undefined}',
  },
]

for (const item of customUpdates) {
  const fullPath = path.join(NEXTJS_APP_ROOT, item.file)
  let code = fs.readFileSync(fullPath, 'utf8')
  if (code.includes(item.from)) {
    code = code.replace(item.from, item.to)
    fs.writeFileSync(fullPath, code, 'utf8')
    console.log('Updated custom file:', item.file)
  } else {
    console.warn('Could not find target string in:', item.file)
  }
}

// 3. Update 225 standard files
const targetDirs = [
  path.join(NEXTJS_APP_ROOT, 'apps/demo-baseline/src/app/zone/baseline'),
  path.join(NEXTJS_APP_ROOT, 'apps/demo-cache-components/src/app/zone/cache'),
]
const allFooters: string[] = []
for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    const af = getAllFiles(dir, ['.tsx', '.ts', '.jsx', '.js'])
    allFooters.push(...af.filter((f) => path.basename(f) === 'VerificationFooter.tsx'))
  }
}

const customFilesSet = new Set(
  [
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/optional-catch-all/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/single-param/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/error/payment-error-boundary/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/loading/skeleton-boundary/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/not-found/missing-product-404/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/rest-api-orders/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/sse-stock-stream/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route/webhook-signature/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/file-conventions/route-groups/group-url-isolation/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-request/geo-ip-parsing/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-response/json-builder/components/VerificationFooter.tsx',
    'apps/demo-baseline/src/app/zone/baseline/functions/next-response/rewrite-virtual/components/VerificationFooter.tsx',
  ].map((f) => path.join(NEXTJS_APP_ROOT, f))
)

let transformedCount = 0

for (const f of allFooters) {
  if (customFilesSet.has(f)) continue

  const content = fs.readFileSync(f, 'utf8')

  const panelMatch = content.match(/<ExpectedActualPanel\s+([\s\S]*?)\/>/)
  if (!panelMatch) continue
  const panelInner = panelMatch[1]

  const titleMatch = panelInner.match(/title=(\{[^}]+\}|\"[^\"]+\")/)
  const expectedMatch = panelInner.match(/expected=(\{[^}]+\}|\"[^\"]+\")/)
  const actualMatch = panelInner.match(/actual=(\{[^}]+\}|\"[^\"]+\")/)
  const descMatch = panelInner.match(/description=(\{[^}]+\}|\"[^\"]+\")/)
  const deepDiveMatch = content.match(/(<DemoDeepDiveCard[\s\S]*?<\/DemoDeepDiveCard>)/)

  if (!titleMatch || !expectedMatch || !actualMatch || !deepDiveMatch) {
    console.error('Failed to match elements in:', f)
    continue
  }

  const titleVal = titleMatch[1]
  const expectedVal = expectedMatch[1]
  const actualVal = actualMatch[1]
  const descVal = descMatch ? descMatch[1] : '"Next.js App Router 공식 표준 스펙에 따라 기술 동작을 검증합니다."'
  const deepDiveVal = deepDiveMatch[1]

  const newCode = `'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = ${expectedVal}
  const defaultActual = ${actualVal}

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 인터랙션 실패 또는 불일치 감지 (동작 재확인이 필요합니다)'
      : '• 인터랙션 대기 중 (상단 데모의 조작 요소를 실행하여 결과를 관찰하세요)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title=${titleVal}
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || ${descVal}}
      />
      ${deepDiveVal}
    </div>
  )
}
`

  fs.writeFileSync(f, newCode, 'utf8')
  transformedCount++
}

console.log('Successfully transformed standard files count:', transformedCount)
