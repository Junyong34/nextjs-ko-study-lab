'use server'

import { after } from 'next/server'
import { createBatchJob, executeBatch } from './lib/batch-store'
import type { BatchMode, RunAnalyticsBatchResult } from './types'

export async function runAnalyticsBatch(mode: BatchMode): Promise<RunAnalyticsBatchResult> {
  // 배치 작업을 등록만 하고, 실제 처리(pbkdf2 배치)는 after() 콜백으로 미룬다.
  // 이 함수는 무거운 작업을 기다리지 않고 즉시 반환되므로, 클라이언트는 배치가
  // 완료되기 훨씬 전에 응답을 받는다 — 완료 여부는 폴링 라우트로 별도 확인한다.
  const job = createBatchJob(mode)

  after(async () => {
    await executeBatch(job.batchId)
  })

  return {
    batchId: job.batchId,
    mode: job.mode,
    responseReturnedAt: job.responseReturnedAt,
  }
}
