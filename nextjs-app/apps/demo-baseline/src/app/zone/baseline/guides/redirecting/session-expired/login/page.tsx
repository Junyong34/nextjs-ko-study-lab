import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/redirecting/session-expired/login')

import React from 'react'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'
import { EXPECTED_RETURN_URL, matchesReturnUrl } from '../verification'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>
}) {
  const { returnUrl } = await searchParams
  const isMatched = matchesReturnUrl(returnUrl)

  return (
    <DemoContainer className="space-y-6">
      <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
        <div className="text-lg font-bold text-amber-800 dark:text-amber-300">세션이 만료되어 로그인이 필요합니다</div>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">로그인 후 돌아갈 경로(returnUrl): {returnUrl ?? '(없음)'}</p>
      </div>
      <ExpectedActualPanel
        title="세션 만료 리다이렉트 검증 결과 (이동 후)"
        expected={`expireSessionAction()의 redirect()가 returnUrl=${EXPECTED_RETURN_URL}과 함께 이 로그인 화면으로 이동시켜야 한다.`}
        actual={
          <>
            현재 URL의 returnUrl 쿼리: <code>{returnUrl ?? '(없음)'}</code>
            <br />이 페이지가 렌더링됐다는 사실 자체가 redirect() 호출(클라이언트 사이드 전환)이 실제로 일어났다는 증거입니다.
          </>
        }
        isMatched={isMatched}
        description="세션 만료 실습 화면에서 이동해 온 결과입니다. returnUrl 값이 기대값과 일치해야 검증이 통과합니다."
      />
    </DemoContainer>
  )
}
