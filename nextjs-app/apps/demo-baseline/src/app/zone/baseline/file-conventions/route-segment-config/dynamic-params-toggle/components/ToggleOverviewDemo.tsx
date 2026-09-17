import React from 'react'
import Link from 'next/link'
import { BASE_PATH, KNOWN_PRODUCT_IDS, UNKNOWN_PRODUCT_ID } from '../catalog'

const KNOWN_ID = KNOWN_PRODUCT_IDS[0]

function BranchColumn({
  branch,
  dynamicParamsValue,
  badgeClass,
  resultKnown,
  resultUnknown,
  unknownNote,
}: {
  branch: 'on-demand' | 'blocked'
  dynamicParamsValue: string
  badgeClass: string
  resultKnown: string
  resultUnknown: string
  unknownNote?: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center justify-between">
        <code className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          dynamicParams = {dynamicParamsValue}
        </code>
        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${badgeClass}`}>
          /{branch}/[productId]
        </span>
      </div>

      <Link
        href={`${BASE_PATH}/${branch}/${KNOWN_ID}`}
        className="flex items-center justify-between rounded border border-zinc-200 bg-white px-3 py-2 text-xs hover:border-blue-400 dark:border-zinc-800 dark:bg-zinc-950"
      >
        <span>
          사전 생성됨: <code className="font-mono text-blue-600 dark:text-blue-400">{KNOWN_ID}</code>
        </span>
        <span className="text-[10px] text-zinc-500">{resultKnown} →</span>
      </Link>

      <Link
        href={`${BASE_PATH}/${branch}/${UNKNOWN_PRODUCT_ID}`}
        className="flex items-center justify-between rounded border border-amber-300 bg-amber-50/40 px-3 py-2 text-xs hover:border-amber-500 dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <span>
          사전 생성 안 됨: <code className="font-mono text-amber-700 dark:text-amber-400">{UNKNOWN_PRODUCT_ID}</code>
        </span>
        <span className="text-[10px] text-amber-700 dark:text-amber-400">{resultUnknown} →</span>
      </Link>
      {unknownNote && <p className="text-[10px] text-zinc-400 leading-relaxed">{unknownNote}</p>}
    </div>
  )
}

export function ToggleOverviewDemo() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">동일한 상품 ID, 두 개의 실제 라우트 트리</h4>
        <p className="text-xs text-zinc-500">
          두 브랜치 모두 같은 <code>generateStaticParams</code>(<code>{KNOWN_PRODUCT_IDS.join(', ')}</code>)를 쓰지만, <code>dynamicParams</code>만 다릅니다.
          같은 미생성 ID(<code>{UNKNOWN_PRODUCT_ID}</code>)로 두 브랜치에 각각 들어가 결과를 대조하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <BranchColumn
          branch="on-demand"
          dynamicParamsValue="true"
          badgeClass="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          resultKnown="예상 200"
          resultUnknown="예상 200"
        />
        <BranchColumn
          branch="blocked"
          dynamicParamsValue="false"
          badgeClass="bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
          resultKnown="예상 200"
          resultUnknown="예상 404"
          unknownNote="※ 클릭하면 사이트 전역 404 화면이 뜹니다 — 실제 404이며, 이유는 사전 생성된 상품 페이지의 검증 패널에서 확인할 수 있습니다."
        />
      </div>
    </div>
  )
}
