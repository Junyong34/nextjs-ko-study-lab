import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_DIR = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(BASE_DIR, 'packages/demos/demos-manifest.json')
const demos = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

function generateInteractiveComponent(d, compName) {
  const url = d.url
  const title = d.title

  // 1. Parallel Fallback (기획전 슬롯 기본 폴백)
  if (url.includes('default/parallel-fallback')) {
    return `'use client'
import React, { useState } from 'react'

export function ${compName}() {
  const [currentTab, setCurrentTab] = useState<'recommended' | 'unmatched'>('recommended')
  
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">쇼핑몰 메인 기획전 슬롯 (@promotions)</h4>
          <p className="text-xs text-zinc-500">라우트 미매칭 시 default.tsx가 기본 배너 슬롯을 안전하게 보존합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentTab('recommended')}
            className={\`rounded px-3 py-1 text-xs font-semibold cursor-pointer \${
              currentTab === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            매칭 탭 (/shoes)
          </button>
          <button
            onClick={() => setCurrentTab('unmatched')}
            className={\`rounded px-3 py-1 text-xs font-semibold cursor-pointer \${
              currentTab === 'unmatched'
                ? 'bg-amber-600 text-white'
                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            미매칭 라우트 (/settings)
          </button>
        </div>
      </div>

      {currentTab === 'recommended' ? (
        <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
          <span className="inline-block rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white mb-2">page.tsx 활성</span>
          <div className="font-semibold text-blue-900 dark:text-blue-300">신규 시즌 신발 카테고리 기획전 배너</div>
          <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">슬롯 경로가 일치하여 전용 기획전 컴포넌트가 마운트되었습니다.</div>
        </div>
      ) : (
        <div className="rounded border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
          <span className="inline-block rounded bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white mb-2">default.tsx 폴백 렌더</span>
          <div className="font-semibold text-amber-900 dark:text-amber-300">전체 베스트셀러 기본 기획전 배너 (기본 폴백)</div>
          <div className="text-xs text-amber-700 dark:text-amber-400 mt-1">하위 라우트가 미매칭되었으나 default.tsx에 의해 404 없이 기본 추천 슬롯이 유지됩니다.</div>
        </div>
      )}
    </div>
  )
}
`
  }

  // 2. Forbidden (403 관리자 권한 차단)
  if (url.includes('forbidden')) {
    return `'use client'
import React, { useState } from 'react'

export function ${compName}() {
  const [userRole, setUserRole] = useState<'customer' | 'admin'>('customer')
  const [accessAttempt, setAccessAttempt] = useState(false)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">스토어 관리자 정산/매출 대시보드 (/admin/settlements)</h4>
          <p className="text-xs text-zinc-500">현재 로그인된 세션의 권한에 따라 forbidden.tsx가 403을 렌더링합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">로그인 역할:</span>
          <button
            onClick={() => { setUserRole('customer'); setAccessAttempt(false); }}
            className={\`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer \${
              userRole === 'customer' ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            일반 고객 (CUSTOMER)
          </button>
          <button
            onClick={() => { setUserRole('admin'); setAccessAttempt(false); }}
            className={\`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer \${
              userRole === 'admin' ? 'bg-purple-600 text-white' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            스토어 관리자 (ADMIN)
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setAccessAttempt(true)}
          className="rounded bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          정산 관리자 페이지 접근 시도
        </button>
      </div>

      {accessAttempt && (
        userRole === 'customer' ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400">
              <span className="rounded bg-red-600 px-2 py-0.5 text-white">403 Forbidden</span>
              접근 권한이 없습니다 (forbidden.tsx 활성)
            </div>
            <p className="mt-1 text-red-600 dark:text-red-300">스토어 입점사 관리자 전용 정산 화면입니다. 일반 고객 계정으로는 열람할 수 없습니다.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-white">200 OK</span>
              정산 데이터 접근 성공
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 font-mono">
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">당월 총 매출: ₩128,450,000</div>
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">정산 예정액: ₩115,605,000</div>
              <div className="rounded bg-white p-2 border dark:bg-zinc-900">미결 주문: 14건</div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
`
  }

  // 3. Draft Mode (비공개 VIP 시크릿 특가전 미리보기)
  if (url.includes('draft-mode')) {
    return `'use client'
import React, { useState } from 'react'

export function ${compName}() {
  const [isDraftMode, setIsDraftMode] = useState(false)

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">VIP 시크릿 특가전 상품 상세</h4>
          <p className="text-xs text-zinc-500">draftMode().enable()로 정적 캐시를 우회하여 미공개 특가 초안 데이터를 즉시 검수합니다.</p>
        </div>
        <button
          onClick={() => setIsDraftMode(!isDraftMode)}
          className={\`rounded px-3 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer \${
            isDraftMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-zinc-700 hover:bg-zinc-800'
          }\`}
        >
          {isDraftMode ? '초안 모드 끄기 (Live 모드 복귀)' : '초안 검수 모드 켜기 (draftMode)'}
        </button>
      </div>

      <div className="rounded border p-4 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">프리미엄 노이즈 캔슬링 헤드폰</span>
            {isDraftMode ? (
              <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">DRAFT PREVIEW (우회 모드)</span>
            ) : (
              <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">LIVE 정적 캐시</span>
            )}
          </div>
          <span className="text-xs text-zinc-500">캐시 상태: {isDraftMode ? 'Bypassed (0ms 검수)' : 'Static HIT'}</span>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-xl font-black text-zinc-900 dark:text-zinc-100">
            {isDraftMode ? '₩249,000 (VIP 40% 특가 초안)' : '₩399,000 (정상 판매가)'}
          </span>
          {isDraftMode && <span className="text-xs text-red-500 font-bold">비공개 시크릿 할인 적용 중</span>}
        </div>
      </div>
    </div>
  )
}
`
  }

  // 4. Default E-commerce Interactive Widget (for other stubs)
  return `'use client'
import React, { useState } from 'react'

export function ${compName}() {
  const [selectedProduct, setSelectedProduct] = useState('PROD-001')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [actionLog, setActionLog] = useState<string[]>([
    '쇼핑몰 세션 초기화: 장바구니 활성화됨 (KRW)'
  ])

  const addLog = (msg: string) => {
    setActionLog(prev => [
      \`[\${new Date().toLocaleTimeString()}] \${msg}\`,
      ...prev.slice(0, 4)
    ])
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">${title} 실습 콘솔</h4>
          <p className="text-xs text-zinc-500">이커머스 비즈니스 규칙과 Next.js 런타임 상호작용을 제어합니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedProduct('PROD-001')
              addLog('상품 선택: 프리미엄 러닝화 (KRW 129,000)')
            }}
            className={\`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer \${
              selectedProduct === 'PROD-001' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            러닝화 (#001)
          </button>
          <button
            onClick={() => {
              setSelectedProduct('PROD-002')
              addLog('상품 선택: 방수 윈드브레이커 (KRW 189,000)')
            }}
            className={\`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer \${
              selectedProduct === 'PROD-002' ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
            }\`}
          >
            윈드브레이커 (#002)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">주문 옵션 및 수량</span>
            <span className="rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-mono dark:bg-zinc-800">{selectedProduct}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (orderQuantity > 1) {
                  setOrderQuantity(q => q - 1)
                  addLog(\`수량 감소: \${orderQuantity - 1}개\`)
                }
              }}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              -
            </button>
            <span className="w-10 text-center font-bold font-mono">{orderQuantity}</span>
            <button
              onClick={() => {
                setOrderQuantity(q => q + 1)
                addLog(\`수량 증가: \${orderQuantity + 1}개\`)
              }}
              className="h-7 w-7 rounded bg-zinc-200 font-bold dark:bg-zinc-700 cursor-pointer"
            >
              +
            </button>
            <button
              onClick={() => addLog(\`Next.js API 트리거: \${selectedProduct} x \${orderQuantity}건 동기화 성공\`)}
              className="ml-auto rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
            >
              동작 실행
            </button>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">실시간 도메인 로그:</div>
          <div className="space-y-1 pt-1 text-[11px]">
            {actionLog.map((log, i) => (
              <div key={i} className={i === 0 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
`
}

let enhancedCount = 0

demos.forEach(d => {
  const basePath = d.zone === 'cache'
    ? path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache', d.url)
    : path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline', d.url)
  const compDir = path.join(basePath, 'components')

  if (!fs.existsSync(compDir)) return

  const files = fs.readdirSync(compDir).filter(f => f.endsWith('.tsx') && !f.includes('VerificationFooter'))
  
  files.forEach(f => {
    const compPath = path.join(compDir, f)
    const currentCode = fs.readFileSync(compPath, 'utf8')

    // If it's a short minimal stub (< 500 chars), enhance it with the rich interactive ecommerce component
    if (currentCode.length < 500) {
      const compName = f.replace('.tsx', '')
      const newCode = generateInteractiveComponent(d, compName)
      fs.writeFileSync(compPath, newCode)
      enhancedCount++
    }
  })
})

console.log(`Successfully upgraded ${enhancedCount} minimal stub components into rich interactive e-commerce playgrounds!`)
