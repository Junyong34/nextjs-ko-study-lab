'use server'

import { revalidatePath } from 'next/cache'
import type { RevalidatePathResult } from './types'

const DEMO_PATH = '/zone/baseline/guides/isr/revalidate-path-sync'

export async function executeRevalidatePathAction(): Promise<RevalidatePathResult> {
  const timestamp = new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })

  // Next.js 공식 revalidatePath 호출 — 이 데모 페이지의 실제 라우트 경로를 대상으로 한다.
  revalidatePath(DEMO_PATH)

  return {
    path: DEMO_PATH,
    status: 'PURGED',
    timestamp,
  }
}
