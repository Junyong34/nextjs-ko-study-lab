import { Suspense } from 'react'
import { readSession } from '../lib/readSession'

/**
 * 측정 대상 ①: cookies()를 <Suspense> 안에서 읽는다. 'use cache'는 쓰지 않는다.
 * 마커는 HTML 속성으로만 매칭한다 (RSC 인라인 스크립트 안의 값은 이스케이프돼 걸리지 않는다).
 */
export default function InsidePage() {
  return (
    <main className="space-y-2 p-6 font-mono text-xs">
      <p data-demo-marker="static">① 정적 마크업 — cookies()와 무관하게 바로 그려지는 영역</p>
      <Suspense fallback={<p data-demo-marker="fallback">② 쿠키 영역 대기 중 (Suspense fallback)</p>}>
        <SessionBlock />
      </Suspense>
    </main>
  )
}

async function SessionBlock() {
  const user = await readSession()
  return (
    <p data-demo-marker="session" data-session-user={user ?? 'none'}>
      ③ 쿠키 영역 — 서버가 읽은 값: {user ?? '(쿠키 없음)'}
    </p>
  )
}
