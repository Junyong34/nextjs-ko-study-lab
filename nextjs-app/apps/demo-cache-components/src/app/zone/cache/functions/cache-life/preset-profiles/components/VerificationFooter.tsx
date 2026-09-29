'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export interface VerificationFooterProps {
  isMatched?: boolean
  expected?: React.ReactNode
  actual?: React.ReactNode
  status?: string | number | null
  description?: string
  isLoaded?: boolean
  logs?: string[]
  count?: number
  [key: string]: any
}

export function VerificationFooter(props: VerificationFooterProps = {}) {
  const {
    isMatched: propIsMatched,
    expected: propExpected,
    actual: propActual,
    status,
    description: propDescription,
    isLoaded,
    logs,
    count,
    ...rest
  } = props

  const isMatched =
    propIsMatched !== undefined
      ? propIsMatched
      : status !== undefined && status !== null
      ? typeof status === 'number'
        ? status >= 200 && status < 400
        : status === 'success' || status === 'valid' || status === 'completed' || status === 'ok'
      : isLoaded !== undefined
      ? Boolean(isLoaded)
      : logs && Array.isArray(logs) && logs.length > 0
      ? true
      : count !== undefined && count > 0
      ? true
      : undefined

  const defaultExpected = '• cacheLife 내장 프리셋 프로필 (seconds, hours, max)의 동작과 기대 결과를 확인합니다.'
  const defaultActual = '• 사용자 조작 후 실제 결과를 표시합니다.'

  const actualContent =
    propActual !== undefined
      ? propActual
      : isMatched === true
      ? defaultActual
      : isMatched === false
      ? '• 상호작용 실패 또는 불일치가 확인되었습니다. 동작을 다시 확인해 주세요.'
      : '• 상호작용 대기 중 (상단 예제의 조작 요소를 실행해 결과를 확인해 주세요.)'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="cacheLife 내장 프리셋 프로필 (seconds, hours, max) 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="Next.js 16.3.2 cacheLife 내장 프리셋 프로파일">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 공식 문서 기준 프리셋 표</h5>
            <p>
              이 프로젝트에 설치된 <code>next@16.3.2</code>의 번들 문서(
              <code>node_modules/next/dist/docs/.../functions/cacheLife.md</code>)에 실린 값이다.
              재정의하지 않는 한 이 초 단위 값이 그대로 적용된다.
            </p>
            <table className="mt-2 w-full border-collapse text-[11px]">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">프로필</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">stale</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">revalidate</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">expire</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr>
                  <td className="py-1">seconds</td>
                  <td>30초</td>
                  <td>1초</td>
                  <td>1분</td>
                </tr>
                <tr>
                  <td className="py-1">hours</td>
                  <td>5분</td>
                  <td>1시간</td>
                  <td>1일</td>
                </tr>
                <tr>
                  <td className="py-1">max</td>
                  <td>5분</td>
                  <td>30일</td>
                  <td>1년</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 데모 예제 기반 동작 원리</h5>
            <p>
              세 프리셋은 각각 독립된 <code>'use cache'</code> 함수(<code>cachedData.ts</code>)에 선언되어 있다.
              페이지 새로고침마다 세 함수가 함께 재요청되지만, revalidate 값이 다르기 때문에 seconds는 거의
              매번 새 캐시 ID로 교체되고, hours/max는 이 실습 세션 안에서는 같은 캐시 ID를 계속 반환한다 —
              이것이 stale-while-revalidate 동작이 실제로 관찰되는 지점이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무적 장점 (Why Use This)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>숫자 대신 <code>'seconds'</code>, <code>'hours'</code>, <code>'max'</code> 같은 직관적인 이름으로 캐시 의도를 코드에 드러낸다.</li>
              <li>초/밀리초 변환 실수나 <code>revalidate</code>보다 짧은 <code>expire</code> 설정 같은 오류를 방지한다.</li>
              <li><code>next.config.ts</code>의 <code>cacheLife</code> 객체로 프리셋 자체를 프로젝트 전역에서 오버라이드할 수 있다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주요 활용 상황 (When to Use)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실시간 주식/재고 수량(cacheLife('seconds'))</li>
              <li>하루 여러 번 갱신되는 상품 재고/날씨(cacheLife('hours'))</li>
              <li>약관, 개인정보처리방침처럼 거의 바뀌지 않는 문서(cacheLife('max'))</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>seconds는 프리렌더 대상에서 제외됨</strong>: expire(1분)가 5분 미만이라 항상 요청 시점에 동적으로 계산되는 "다이나믹 홀"이 된다.</li>
              <li><strong>stale은 서버가 아니라 클라이언트 라우터 캐시 값</strong>: 최소 30초가 강제되므로, 브라우저 하드 새로고침(F5)에서 관찰되는 갱신 주기는 stale이 아니라 revalidate/expire다.</li>
              <li><strong>hours/max에서 변화가 없는 것이 정상</strong>: 강제로 무효화하려면 같은 함수에 선언한 <code>cacheTag</code>를 <code>revalidateTag</code>로 호출해야 한다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
