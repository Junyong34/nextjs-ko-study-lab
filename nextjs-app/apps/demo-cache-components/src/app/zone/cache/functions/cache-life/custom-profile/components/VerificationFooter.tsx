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

  const defaultExpected = '• next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩의 동작과 기대 결과를 확인합니다.'
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
        title="next.config.ts에서 custom cacheLife 프로필 정의 및 바인딩 검증 결과"
        expected={propExpected || defaultExpected}
        actual={actualContent}
        isMatched={isMatched}
        description={propDescription || '이 예제의 동작과 검증 결과를 표시합니다.'}
      />
      <DemoDeepDiveCard title="Next.js 16.3.2 cacheLife 커스텀 프로필 정의 및 바인딩">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 내장 프리셋 vs 커스텀 정의</h5>
            <p>
              형제 데모(<code>functions/cache-life/preset-profiles</code>)는 <code>cacheLife('seconds')</code>,{' '}
              <code>('hours')</code>, <code>('max')</code>처럼 <strong>next.config.ts를 전혀 건드리지 않고도</strong>{' '}
              쓸 수 있는 내장 프리셋 세 개를 시연한다. 이 데모는 그 내장 프리셋의 stale/revalidate/expire 조합이
              우리 비즈니스 요구(재입고 알림 20/45/240초)와 맞지 않을 때, <strong>next.config.ts의 cacheLife
              객체에 직접 이름과 초 값을 선언</strong>하고 그 이름을 <code>cacheLife('functions-cache-life-custom-profile:restock-alert')</code>
              로 호출해 바인딩하는 절차를 보여준다.
            </p>
            <table className="mt-2 w-full border-collapse text-[11px]">
              <thead>
                <tr className="text-left text-zinc-500 dark:text-zinc-400">
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">구분</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">next.config.ts 수정</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">stale</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">revalidate</th>
                  <th className="border-b border-zinc-200 pb-1 dark:border-zinc-800">expire</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                <tr>
                  <td className="py-1">functions-cache-life-custom-profile:restock-alert</td>
                  <td>필요</td>
                  <td>20초</td>
                  <td>45초</td>
                  <td>240초</td>
                </tr>
                <tr>
                  <td className="py-1">minutes (내장)</td>
                  <td>불필요</td>
                  <td>300초</td>
                  <td>60초</td>
                  <td>3600초</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. next.config.ts 스키마 (교차 검증 결과)</h5>
            <p>
              이 프로젝트에 설치된 <code>next@16.3.2</code> 번들 문서(
              <code>node_modules/next/dist/docs/.../config/next-config-js/cacheLife.md</code>)와 실제 zod 설정
              스키마(<code>node_modules/next/dist/server/config-schema.js</code>)를 대조한 결과, <code>cacheLife</code>는{' '}
              <code>cacheComponents</code>와 마찬가지로 <strong>next.config.ts 최상위 필드</strong>다.
              (<code>experimental.cacheLife</code>는 구버전 호환용으로 스키마에는 남아 있지만, 공식 문서의 모든
              예제는 최상위 사용법만 안내한다.)
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 데모 예제 기반 동작 원리</h5>
            <p>
              두 프로필 모두 각각 독립된 <code>'use cache'</code> 함수(<code>cachedData.ts</code>)에 선언되어 있다.
              페이지 새로고침마다 두 함수가 함께 재요청되지만, revalidate 값(45초 vs 60초)이 다르기 때문에 두
              카드의 캐시 ID가 서로 다른 시점에 교체된다 — 커스텀 프로필이 실제로 독립된 TTL로 동작함을 눈으로
              확인하는 지점이다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실무 주의사항 및 핵심 팁 (Caution & Tips)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li><strong>프로필 이름에 데모 접두사 필수</strong>: <code>cacheLife</code> 프로필 이름과 <code>cacheTag</code>는
                앱 전역 네임스페이스라, 접두사가 없으면 다른 데모의 캐시와 이름이 충돌한다
                (<code>apps/AGENTS.md</code> 8항).</li>
              <li><strong>내장 이름 재정의도 가능</strong>: <code>seconds</code>·<code>hours</code>·<code>max</code> 같은
                내장 이름으로 다시 정의하면 그 프리셋 자체의 값을 프로젝트 전역에서 바꿀 수 있지만, 이 데모는 혼동을
                막기 위해 새 이름(<code>functions-cache-life-custom-profile:restock-alert</code>)을 썼다.</li>
              <li><strong>expire는 revalidate보다 커야 함</strong>: Next.js가 빌드 시점에 이 조건을 검증하고, 위반하면
                에러를 낸다.</li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
