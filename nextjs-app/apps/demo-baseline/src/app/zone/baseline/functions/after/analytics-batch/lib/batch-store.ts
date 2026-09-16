import { pbkdf2 } from 'node:crypto'
import { promisify } from 'node:util'
import { ANALYTICS_EVENT_COUNT, type AnalyticsEventStatus, type BatchMode, type BatchStatusResponse } from '../types'

const pbkdf2Async = promisify(pbkdf2)

// 이벤트 1건당 PBKDF2-SHA256 해시 연산(실제 CPU 바인딩 비동기 작업)을 수행한다.
// 100만 회 반복은 이 데모 환경 기준 건당 약 200~300ms가 걸려, 순차/병렬 처리 시간 차이를
// 눈으로 관찰 가능한 수준으로 만든다. setTimeout 시뮬레이션이 아니라 실제 연산이므로
// 병렬 실행 시 실제로 총 소요 시간이 줄어드는 것을 실측할 수 있다 (No-Simulation 원칙).
const HASH_ITERATIONS = 1_000_000

const EVENT_LABELS = [
  '데이터 웨어하우스(DW) 구매 전환 이벤트 적재',
  '재고 배치 동기화',
  '추천 피처 스토어 갱신',
] as const

interface BatchJob {
  batchId: string
  mode: BatchMode
  responseReturnedAt: number
  batchStartedAt: number | null
  batchCompletedAt: number | null
  events: AnalyticsEventStatus[]
}

// 데모용 인메모리 저장소. dev 서버 프로세스 안에서만 유지된다.
// Turbopack은 'use server' 액션(actions.ts)과 Route Handler(api/route.ts)를 서로 다른
// 모듈 그래프로 각각 번들링하므로, 이 파일을 단순 모듈 스코프 변수(let jobs = new Map())로
// 두면 두 그래프가 서로 다른 인스턴스를 갖게 되어 상태가 공유되지 않는다(실측 중 발견:
// 액션에서 등록한 batchId를 라우트가 "not found"로 못 찾음). Prisma 싱글턴과 동일한 방식으로
// 같은 Node.js 프로세스의 진짜 전역 객체(globalThis)에 저장해 모듈 그래프가 갈라져도
// 하나의 Map을 공유하도록 만든다.
const GLOBAL_STORE_KEY = Symbol.for('nextjs-ko-study-lab.functions-after-analytics-batch-store')

interface GlobalBatchStore {
  jobs: Map<string, BatchJob>
  sequence: number
}

function getStore(): GlobalBatchStore {
  const g = globalThis as unknown as { [GLOBAL_STORE_KEY]?: GlobalBatchStore }
  if (!g[GLOBAL_STORE_KEY]) {
    g[GLOBAL_STORE_KEY] = { jobs: new Map<string, BatchJob>(), sequence: 0 }
  }
  return g[GLOBAL_STORE_KEY]
}

export function createBatchJob(mode: BatchMode): BatchJob {
  const store = getStore()
  store.sequence += 1
  const batchId = `batch-${Date.now()}-${store.sequence}`
  const job: BatchJob = {
    batchId,
    mode,
    responseReturnedAt: Date.now(),
    batchStartedAt: null,
    batchCompletedAt: null,
    events: EVENT_LABELS.map((name) => ({
      name,
      status: 'pending',
      startedAt: null,
      completedAt: null,
      durationMs: null,
    })),
  }
  store.jobs.set(batchId, job)
  return job
}

async function runEvent(job: BatchJob, index: number): Promise<void> {
  const event = job.events[index]
  event.status = 'running'
  event.startedAt = Date.now()
  await pbkdf2Async(`${job.batchId}:${index}`, job.batchId, HASH_ITERATIONS, 32, 'sha256')
  event.completedAt = Date.now()
  event.durationMs = event.completedAt - event.startedAt
  event.status = 'done'
}

export async function executeBatch(batchId: string): Promise<void> {
  const job = getStore().jobs.get(batchId)
  if (!job) return

  job.batchStartedAt = Date.now()
  if (job.mode === 'parallel') {
    await Promise.all(job.events.map((_, index) => runEvent(job, index)))
  } else {
    for (let index = 0; index < job.events.length; index += 1) {
      await runEvent(job, index)
    }
  }
  job.batchCompletedAt = Date.now()
}

export function getBatchStatus(batchId: string): BatchStatusResponse | null {
  const job = getStore().jobs.get(batchId)
  if (!job) return null

  return {
    batchId: job.batchId,
    mode: job.mode,
    responseReturnedAt: job.responseReturnedAt,
    batchStartedAt: job.batchStartedAt,
    batchCompletedAt: job.batchCompletedAt,
    isComplete: job.batchCompletedAt !== null,
    events: job.events.map((event) => ({ ...event })),
  }
}

if (EVENT_LABELS.length !== ANALYTICS_EVENT_COUNT) {
  throw new Error('EVENT_LABELS와 ANALYTICS_EVENT_COUNT가 일치하지 않습니다.')
}
