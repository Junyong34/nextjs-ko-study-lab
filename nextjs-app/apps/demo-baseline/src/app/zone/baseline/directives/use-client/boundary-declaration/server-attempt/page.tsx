import { connection } from 'next/server'

/**
 * 이 파일 최상단에는 'use client'가 없다 — 실제 Server Component다.
 * 아래 버튼의 onClick은 직렬화할 수 없는 함수이므로,
 * Next.js가 이 페이지를 렌더링하는 시점에 실제로 에러를 던진다.
 * 그 에러는 형제 파일 error.tsx가 그대로 받아 화면에 표시한다.
 *
 * connection(): 이 렌더링 에러는 항상 발생하므로, next build의 정적 프리렌더링
 * (빌드 타임 렌더링) 단계에서도 그대로 터져 빌드 자체를 실패시킨다. 학습 목적은
 * "요청 시점의 런타임 에러"를 보여주는 것이므로 실제 요청이 들어올 때까지
 * 렌더링을 미뤄 정적 생성 대상에서 제외한다(같은 zone의
 * guides/server-and-client-boundary/props-serialization/function-prop-error 데모와 동일한 방식).
 */
export default async function ServerAttemptPage() {
  await connection()

  return (
    <div className="space-y-3 rounded-md border border-rose-200 bg-white p-4 text-xs dark:border-rose-900/40 dark:bg-zinc-950">
      <p className="text-zinc-600 dark:text-zinc-400">
        이 페이지는 <code>&apos;use client&apos;</code>가 없는 Server Component입니다. 아래 버튼에는{' '}
        <code>onClick</code> 핸들러가 직접 바인딩되어 있습니다 — 정상적인 Next.js 16.3.2 런타임이라면 이 렌더링
        자체가 실패해야 합니다.
      </p>
      <button
        type="button"
        onClick={() => {
          console.log('이 로그는 절대 찍히지 않는다 — 렌더링 단계에서 이미 거부된다')
        }}
        className="rounded bg-rose-600 px-4 py-2 font-medium text-white"
      >
        서버 컴포넌트 버튼 (렌더링 자체가 실패해야 정상)
      </button>
    </div>
  )
}
