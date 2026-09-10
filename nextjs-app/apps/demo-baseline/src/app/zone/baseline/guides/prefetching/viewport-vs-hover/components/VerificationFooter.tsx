'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { PrefetchCounts } from '../types'

interface VerificationFooterProps {
  counts: PrefetchCounts
  isDev: boolean
}

export function VerificationFooter({ counts, isDev }: VerificationFooterProps) {
  const disabledOk = counts.disabledCount === 0
  const autoOk = isDev ? true : counts.autoCount > 0
  const isMatched = disabledOk && autoOk

  const expected = isDev
    ? [
        '- prefetch={false} 링크: 자동 요청 0건 유지 (호버해도 발생하지 않음)',
        '- 기본 링크: 개발 서버(pnpm dev)에서는 0건이 정상 — 자동 prefetch는 production 전용 동작',
      ].join('\n')
    : [
        '- prefetch={false} 링크: 자동 요청 0건 유지 (호버해도 발생하지 않음)',
        '- 기본 링크: 뷰포트 진입 즉시 1건 이상 관찰됨',
      ].join('\n')

  const actual = [
    `- prefetch={false} 링크 실제 요청: ${counts.disabledCount}건`,
    `- 기본 링크 실제 요청: ${counts.autoCount}건`,
    `- 현재 모드: ${isDev ? 'development' : 'production'}`,
  ].join('\n')

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="뷰포트 자동 prefetch와 prefetch={false} 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="숫자는 브라우저 Resource Timing API로 실측한 실제 네트워크 요청 건수이며, 버튼 클릭 여부와 무관하게 항상 실제 상태를 반영합니다."
      />
      <DemoDeepDiveCard title="자동 prefetch와 prefetch={false}의 실제 동작">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 뷰포트 자동 prefetch는 production 전용</h5>
            <p>
              prefetch prop을 지정하지 않은 기본 <code>{'<Link>'}</code>는 <code>IntersectionObserver</code>로 뷰포트 진입을
              감지해 자동으로 prefetch 요청을 보냅니다. 이 자동 요청은 <strong>production 빌드에서만</strong> 발생하며, 개발
              서버(<code>next dev</code>)에서는 불필요한 서버 부하를 막기 위해 생략됩니다. 위 &quot;기본 링크&quot; 카드의
              값이 개발 모드에서 0건인 것은 버그가 아니라 Next.js의 명시된 사양입니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. prefetch={'{'}false{'}'}는 호버로도 대체되지 않는다</h5>
            <p>
              <code>prefetch={'{'}false{'}'}</code>는 자동 prefetch를 완전히 비활성화하는 옵션입니다. 뷰포트 진입은 물론
              호버 시점에도 백그라운드 요청을 보내지 않으며, 실제 요청은 사용자가 링크를 클릭해 이동하는 순간에만
              발생합니다. &quot;호버하면 대신 요청을 보낸다&quot;는 것은 흔한 오해입니다 — 호버 시점 prefetch를 원한다면
              <code> prefetch={'{'}active ? null : false{'}'}</code> 패턴으로 직접 감싼 커스텀 Link가 필요합니다(공식 가이드의
              Hover-triggered prefetch 패턴).
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 실제로 확인하는 방법</h5>
            <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>
                이 저장소에서는 <code>pnpm --filter @study/demo-baseline build</code> 후{' '}
                <code>pnpm --filter @study/demo-baseline start</code>로 production 서버를 띄우면 기본 링크의 요청 건수가
                올라가는 것을 이 페이지에서 그대로 관찰할 수 있습니다.
              </li>
              <li>
                DevTools Network 탭에서 요청을 선택하면 <code>rsc: 1</code>, <code>next-router-prefetch: 1</code> 헤더가
                붙어 있어 일반 페이지 이동과 구분되는 진짜 prefetch 요청임을 직접 확인할 수 있습니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 언제 prefetch={'{'}false{'}'}를 쓰는가</h5>
            <p>
              무한 스크롤 목록처럼 뷰포트에 수십 개의 링크가 동시에 들어오는 화면에서는 자동 prefetch가 불필요한 대역폭을
              소모합니다. 이런 화면의 링크에 <code>prefetch={'{'}false{'}'}</code>를 지정하면 클릭 시점에만 요청이 발생해
              트래픽을 절약할 수 있습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
