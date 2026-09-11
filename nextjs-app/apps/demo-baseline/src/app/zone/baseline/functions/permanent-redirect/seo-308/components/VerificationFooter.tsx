'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { ProbeKind, ProbeResult } from '../types'

export interface VerificationFooterProps {
  probes: Partial<Record<ProbeKind, ProbeResult>>
}

const EXPECTED_STATUS: Record<ProbeKind, number> = {
  permanent: 308,
  temporary: 307,
}

function formatActual(probe?: ProbeResult) {
  if (!probe) {
    return '• 대기 중 (위 "실제 상태 코드 측정" 버튼을 눌러 실제 Route Handler 응답을 확인하세요.)'
  }
  return `• HTTP ${probe.status} ${probe.statusText}\n• Location: ${probe.location ?? '(없음)'}`
}

export function VerificationFooter({ probes }: VerificationFooterProps) {
  const permanentMatched = probes.permanent ? probes.permanent.status === EXPECTED_STATUS.permanent : undefined
  const temporaryMatched = probes.temporary ? probes.temporary.status === EXPECTED_STATUS.temporary : undefined

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <ExpectedActualPanel
          title="permanentRedirect() 영구 이전 검증"
          expected={`HTTP ${EXPECTED_STATUS.permanent} Permanent Redirect`}
          actual={formatActual(probes.permanent)}
          isMatched={permanentMatched}
          description="/legacy/items/{id} 요청이 permanentRedirect()를 거쳐 실제로 308을 반환하는지 확인합니다."
        />
        <ExpectedActualPanel
          title="redirect() 임시 이전 대비 검증"
          expected={`HTTP ${EXPECTED_STATUS.temporary} Temporary Redirect`}
          actual={formatActual(probes.temporary)}
          isMatched={temporaryMatched}
          description="/legacy/promo/{id} 요청이 redirect()를 거쳐 실제로 307을 반환하는지 확인합니다."
        />
      </div>

      <DemoDeepDiveCard title="permanentRedirect() HTTP 308 영구 SEO 리다이렉트">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙 및 동작 원리</h5>
            <p>
              <code>permanentRedirect()</code>(<code>next/navigation</code>)와 <code>redirect()</code>는 같은
              <code>NEXT_REDIRECT</code> 예외 메커니즘을 공유한다. 다만 <code>permanentRedirect()</code>는 Route
              Handler에서 실제 HTTP <strong>308 Permanent Redirect</strong>를, <code>redirect()</code>는{' '}
              <strong>307 Temporary Redirect</strong>를 반환한다는 점만 다르다. 위 두 카드에서 같은 방식으로 요청한
              두 Route Handler가 서로 다른 실제 상태 코드를 반환하는 것을 직접 측정값으로 확인할 수 있다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 이 데모의 시나리오</h5>
            <p>
              구형 숫자 ID URL(<code>/legacy/items/1001</code>)은 상품 URL 체계가 영구히 <code>/shop/running-shoes</code>
              같은 SEO 슬러그로 개편된 상황을 나타내므로 <code>permanentRedirect()</code>를 쓴다. 반면{' '}
              <code>/legacy/promo/1001</code>은 주말 한정 프로모션처럼 조만간 원래 URL로 되돌아올 일시적인 이동이므로{' '}
              <code>redirect()</code>를 쓴다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. SEO 관점에서의 차이 (왜 상태 코드가 중요한가)</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>308</strong>: 검색엔진 크롤러가 기존 URL의 색인·백링크 점수를 신규 URL로 이전한다. 기존
                URL은 검색 결과에서 신규 URL로 대체된다.
              </li>
              <li>
                <strong>307</strong>: 검색엔진은 기존 URL의 색인을 그대로 유지하고, 신규 URL은 임시 목적지로만
                취급한다. 프로모션이 끝나면 원래 URL이 다시 정상 노출된다.
              </li>
              <li>
                <strong>HTTP 메서드 보존</strong>: 전통적인 301/302와 달리 308/307은 요청 메서드(GET/POST 등)를
                그대로 보존한다 — 레거시 301이 POST를 GET으로 바꿔버리던 문제가 없다.
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 실습으로 확인하기 어려운 부분: 303</h5>
            <p>
              공식 문서에 따르면 <code>permanentRedirect()</code>/<code>redirect()</code> 둘 다 Server Action에서
              자바스크립트 없이(progressive enhancement) 폼이 제출된 경우에는 303 See Other를 반환한다. 이 303은
              브라우저의 자바스크립트를 강제로 꺼야 재현되므로, 이 실습 화면(항상 JS가 켜진 SPA 환경)에서는 실제로
              트리거할 수 없다 — 같은 zone의 <code>functions/redirect/action-303</code> 데모가 그 경로를 전담한다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">5. 실무 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>강력한 브라우저 캐싱</strong>: 308은 영구 리다이렉트라는 의미상 브라우저가 휴리스틱으로
                응답을 캐시할 수 있다. 같은 legacy URL을 반복 테스트할 때는 curl이나 시크릿 창, DevTools의
                &quot;Disable cache&quot;를 사용해야 매 요청마다 서버를 실제로 다시 거치는지 확인할 수 있다.
              </li>
              <li>
                <strong>try/catch 바깥에서 호출</strong>: <code>permanentRedirect()</code>도 내부적으로 예외를
                던지므로 <code>try/catch</code> 블록 밖에서 호출해야 한다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
