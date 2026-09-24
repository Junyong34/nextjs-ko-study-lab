import { connection } from 'next/server'
import { getCategoryStats } from '../queries'
import { getSummaryInstance } from '../class-probe'
import {
  formatServerTime,
  toCategory,
  toCurrency,
  type CategoryStats,
  type RequestObservation,
  type ReturnTypeCheck,
} from '../types'
import { StatsControls } from './StatsControls'
import { StatsResultCard } from './StatsResultCard'
import { ReturnTypePanel } from './ReturnTypePanel'
import { RequestReporter } from './ObservationContext'

async function probeClassInstance(category: string): Promise<ReturnTypeCheck['classInstance']> {
  try {
    const value: unknown = await getSummaryInstance(category)
    const proto = value === null || typeof value !== 'object' ? String(value) : Object.getPrototypeOf(value)?.constructor?.name
    return { ok: true, detail: `반환됨 (constructor: ${proto})` }
  } catch (e) {
    // prod에서는 메시지가 일반 문구로 가려지고, 서버 로그에 원문과 같은 digest가 남는다.
    const digest = (e as { digest?: string } | null)?.digest
    const message = e instanceof Error ? e.message : String(e)
    return { ok: false, error: digest ? `${message} (digest: ${digest})` : message }
  }
}

function checkTypes(stats: CategoryStats, classInstance: ReturnTypeCheck['classInstance']): ReturnTypeCheck {
  return {
    dateIsDate: stats.generatedAt instanceof Date,
    mapIsMap: stats.priceByProduct instanceof Map,
    setIsSet: stats.tags instanceof Set,
    classInstance,
  }
}

/**
 * 캐시 밖(요청 시점)에서 searchParams를 읽고, 직렬화 가능한 값만 캐시 함수의 인자로 넘긴다.
 * 같은 요청 안에서 두 곳이 같은 인자로 getCategoryStats를 따로 호출한다.
 */
export async function StatsStage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  // 요청 시점 렌더링을 명시한다. prod 빌드 프리렌더가 캐시 엔트리를 미리 채우지 않게 한다.
  await connection()
  const category = toCategory(params.category)
  const currency = toCurrency(params.currency)

  // 호출 A(요약 카드), 호출 B(상세 표): 인자 객체는 매번 새로 만들지만 내용이 같으므로 같은 캐시 키다.
  const [statsA, statsB, classInstance] = await Promise.all([
    getCategoryStats(category, { currency }),
    getCategoryStats(category, { currency }),
    probeClassInstance(category),
  ])

  const observation: RequestObservation = {
    requestId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    requestAt: formatServerTime(new Date()),
    argsKey: `${category}|${currency}`,
    callA: {
      cacheId: statsA.cacheId,
      globalExecNo: statsA.globalExecNo,
      argsExecNo: statsA.argsExecNo,
      generatedAt: formatServerTime(new Date(statsA.generatedAt)),
    },
    callB: { cacheId: statsB.cacheId, globalExecNo: statsB.globalExecNo, argsExecNo: statsB.argsExecNo },
    types: checkTypes(statsA, classInstance),
  }

  return (
    <div className="space-y-3">
      <StatsControls category={category} currency={currency} />
      <div className="rounded-md border border-dashed border-emerald-400 bg-emerald-50/60 px-3 py-2 font-mono text-[11px] dark:border-emerald-800 dark:bg-emerald-950/20">
        <span className="font-sans font-semibold text-emerald-800 dark:text-emerald-300">이번 요청 (캐시 밖) </span>
        <span className="text-zinc-500">요청 시각 </span>
        <strong data-testid="request-at" className="text-emerald-700 dark:text-emerald-300">{observation.requestAt}</strong>
        <span className="ml-3 text-zinc-500">요청 ID </span>
        <strong data-testid="request-id" className="text-emerald-700 dark:text-emerald-300">#{observation.requestId}</strong>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <StatsResultCard label="호출 A · 요약 카드" testId="call-a" stats={statsA} />
        <StatsResultCard label="호출 B · 상세 표" testId="call-b" stats={statsB} showRows />
      </div>
      <ReturnTypePanel check={observation.types} stats={statsA} />
      <RequestReporter observation={observation} />
    </div>
  )
}
