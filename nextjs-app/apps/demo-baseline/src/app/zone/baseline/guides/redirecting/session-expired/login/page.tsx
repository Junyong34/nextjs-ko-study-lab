import React from 'react'
import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>
}) {
  const { returnUrl } = await searchParams

  return (
    <DemoContainer className="space-y-6">
      <div className="rounded-lg border border-amber-300 bg-amber-50/60 p-6 text-center dark:border-amber-900 dark:bg-amber-950/30">
        <div className="text-lg font-bold text-amber-800 dark:text-amber-300">세션이 만료되어 로그인이 필요합니다</div>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">로그인 후 돌아갈 경로: {returnUrl}</p>
      </div>
      <ExpectedActualPanel
        title="Server Action redirect() 세션 만료 검증"
        expected="redirect('/login?returnUrl=/checkout')가 실제로 307 응답을 보내고 브라우저가 이 로그인 페이지로 이동해야 한다."
        actual={`- 현재 URL의 returnUrl 쿼리: ${returnUrl}\n- 이 페이지 렌더링 자체가 redirect() 발생의 증거`}
        isMatched={returnUrl === '/checkout'}
      />
    </DemoContainer>
  )
}
