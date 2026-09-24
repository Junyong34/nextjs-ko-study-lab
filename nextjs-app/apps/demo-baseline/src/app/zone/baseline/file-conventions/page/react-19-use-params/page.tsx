import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/page/react-19-use-params')

/**
 * 기본 경로. 가이드·실습·검증·개념 정리 4단 레이아웃은 layout.tsx가 그리고,
 * 이 페이지는 예제 라우트(server/[sku], client/[sku])로 이동하기 전의 안내만 표시한다.
 */
export default function React19UseParamsIndexPage() {
  return (
    <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
      <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">예제 선택 전 (기본 경로)</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
        위 링크로 실제 다이나믹 세그먼트 라우트로 이동하세요. <code>server/[sku]</code>는 Server Component page가{' '}
        <code>await params</code>로, <code>client/[sku]</code>는 <code>&apos;use client&apos;</code> page가{' '}
        <code>use(params)</code>로 같은 Promise 형태의 props를 언래핑합니다.
      </p>
    </div>
  )
}
