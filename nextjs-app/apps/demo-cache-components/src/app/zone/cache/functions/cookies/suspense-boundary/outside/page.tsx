import { readSession } from '../lib/readSession'

/**
 * 측정 대상 ②: 같은 cookies() 읽기를 <Suspense> 없이 한다.
 * cacheComponents: true에서는 이렇게 쓰면 prerender가 막혀 빌드가 실패한다.
 * 아래 export로 정적 셸을 포기한다고 명시해야만 허용된다(기존 enable-flag/blocking과 같은 방식).
 */
export const instant = false

export default async function OutsidePage() {
  const user = await readSession()
  return (
    <main className="space-y-2 p-6 font-mono text-xs">
      <p data-demo-marker="static">① 정적 마크업 — 하지만 아래 cookies()가 끝날 때까지 함께 막힌다</p>
      <p data-demo-marker="session" data-session-user={user ?? 'none'}>
        ③ 쿠키 영역 — 서버가 읽은 값: {user ?? '(쿠키 없음)'}
      </p>
    </main>
  )
}
