'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ProbeResult } from '../types'

export interface VerificationFooterProps {
  latestNormal?: ProbeResult
  latestRsc?: ProbeResult
}

export function VerificationFooter({ latestNormal, latestRsc }: VerificationFooterProps) {
  const bothRan = Boolean(latestNormal && latestRsc)

  const isMatched = bothRan
    ? Boolean(
        latestNormal!.contentType?.startsWith('text/html') &&
          !latestNormal!.redirected &&
          latestRsc!.contentType === 'text/x-component' &&
          latestRsc!.redirected
      )
    : undefined

  const expected =
    '일반 요청 → text/html, redirected=false\nRSC 프리페치 신호 요청 → text/x-component, redirected=true'

  const actual = bothRan
    ? `일반 요청 → ${latestNormal!.contentType ?? '(none)'}, redirected=${latestNormal!.redirected}\nRSC 프리페치 신호 요청 → ${latestRsc!.contentType ?? '(none)'}, redirected=${latestRsc!.redirected}`
    : '• 2단에서 두 버튼을 모두 한 번씩 눌러 실제 요청을 보내면 결과가 여기 표시됩니다.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="RSC 프리페치 신호 요청·응답 검증"
        expected={expected}
        actual={actual}
        isMatched={isMatched}
        description="같은 URL에 헤더만 다르게 보낸 두 실제 요청의 서버 응답(Content-Type, redirect 여부)을 대조합니다."
      />
      <DemoDeepDiveCard title="route segment config 'instant' / 'prefetch'의 정확한 정의">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              1. 이 페이지 제목이 가리키는 실제 API
            </h5>
            <p>
              Next.js 16.3.2 기준 <code>instant</code> route segment config는 실재하는
              API입니다(<code>node_modules/next/dist/docs/.../route-segment-config/instant.md</code>{' '}
              1차 확인). 그런데 그 역할은 &ldquo;호버 시 0ms로 prefetch를 실행하는 설정&rdquo;이
              아니라, <strong>이 세그먼트로의 내비게이션이 즉시(instant) UI를 만들어내는지를 개발
              오버레이에서 검증(validation)해 주는 개발 전용 도구</strong>입니다. 실제 prefetch
              시점·범위를 제어하는 것은 별도의 <code>prefetch</code> route segment config(
              <code>&apos;auto&apos;</code> | <code>&apos;partial&apos;</code> |{' '}
              <code>&apos;force-disabled&apos;</code>)입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              2. 왜 이 데모에서 라이브로 켜서 보여줄 수 없는가
            </h5>
            <p>
              공식 문서는 두 export 모두 <code>cacheComponents: true</code>가 켜져 있을 때만
              동작한다고 명시합니다. 이 저장소에서 <code>cacheComponents</code>는{' '}
              <code>demo-cache-components</code> zone의 몫이고, 이 페이지가 속한{' '}
              <code>demo-baseline</code>의 <code>next.config.ts</code>에는 켜져 있지 않습니다.
              공유 설정 파일을 zone 경계를 넘어 고치는 대신, 이 zone 안에서 실제로 관찰 가능한
              인접 개념(아래 3번)으로 대체했습니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              3. 이 데모에서 실제로 측정한 것
            </h5>
            <p>
              <code>cacheComponents</code> 없이도 항상 존재하는 것은 Next.js 클라이언트 라우터가
              내비게이션·프리페치 시 실제로 보내는 <code>RSC</code>,{' '}
              <code>Next-Router-Prefetch</code> 요청 헤더입니다. 위 실습에서 같은 URL에 이 헤더를
              실었을 때만 서버가 307로 리다이렉트한 뒤 <code>Content-Type: text/x-component</code>
              (React Flight 페이로드)를 돌려주고, 헤더가 없으면 <code>text/html</code> 전체 문서를
              돌려주는 것을 <code>curl</code>과 실제 <code>fetch()</code>로 동일하게 확인했습니다.
              이것이 &ldquo;즉시 전환&rdquo;을 가능하게 하는 실제 하부 프로토콜입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              4. 실무 주의사항
            </h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>자동 prefetch는 프로덕션에서만 동작합니다.</strong> <code>{'<Link>'}</code>가
                뷰포트에 들어오거나 호버될 때 자동으로 prefetch하는 동작은{' '}
                <code>next dev</code>에서 발생하지 않습니다(공식 문서 명시). 이 페이지를{' '}
                <code>next dev</code>로 열어 두고 링크에 마우스를 올려도 자동 요청이 안 보이는
                것은 버그가 아니라 이 제약 때문입니다 — 위 실습의 두 버튼은 자동 prefetch가 아니라
                수동으로 같은 헤더 조합을 재현한 것입니다.
              </li>
              <li>
                <code>{'<Link prefetch={false}>'}</code>는 뷰포트 진입·호버 모두에서 prefetch를
                끕니다. 링크가 매우 많은 목록(무한 스크롤 등)에서 리소스 낭비를 막을 때 씁니다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 흔한 오용</h5>
            <p>
              <code>instant</code>를 &ldquo;켜면 빨라지는 성능 스위치&rdquo;로 오해하는 것이 가장
              흔한 오용입니다. 실제로는 아무것도 빠르게 만들지 않고, 이미 만들어 둔 캐싱 구조가
              즉시 UI 기대를 깨는 코드를 dev 오버레이에서 미리 잡아 주는 린트에 가깝습니다.
            </p>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
